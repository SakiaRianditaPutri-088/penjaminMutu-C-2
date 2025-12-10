<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use App\Models\User;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $supabaseService;

    public function __construct(SupabaseService $supabaseService)
    {
        $this->supabaseService = $supabaseService;
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'full_name' => 'required|string|max:255',
        ]);

        try {
            // Register user in Supabase (using public signup endpoint)
            $supabaseResponse = $this->supabaseService->createUser(
                $request->email,
                $request->password,
                $request->full_name
            );

            // Extract user data - signup response contains user at root level
            $supabaseUser = $supabaseResponse['user'] ?? $supabaseResponse;
            
            // Get user ID - could be at different places in response
            $userId = $supabaseUser['id'] ?? $supabaseResponse['id'] ?? null;
            $userEmail = $supabaseUser['email'] ?? $supabaseResponse['email'] ?? $request->email;
            
            // Get access token if available (only if email confirmation is disabled)
            $accessToken = $supabaseResponse['access_token'] 
                ?? $supabaseResponse['session']['access_token'] 
                ?? null;

            if (!$userId) {
                throw new \Exception('Failed to create user in Supabase - no user ID returned');
            }

            // Sync user to database
            try {
                $user = User::updateOrCreate(
                    ['id' => $userId],
                    [
                        'email' => $userEmail,
                        'full_name' => $request->full_name,
                        'provider' => 'email',
                        'is_active' => true,
                    ]
                );
                
                Log::info('User synced to database', ['user_id' => $user->id]);

                // Log registration
                try {
                    LoginLog::create([
                        'user_id' => $user->id,
                        'provider' => 'email',
                        'success' => true,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ]);
                } catch (\Exception $logError) {
                    // Log error but don't fail registration
                    Log::warning('Failed to create login log: ' . $logError->getMessage());
                }
            } catch (\Exception $dbError) {
                Log::error('Failed to save user to database: ' . $dbError->getMessage(), [
                    'user_id' => $userId,
                    'error' => $dbError->getTraceAsString(),
                ]);
                
                // Still return success if Supabase user was created
                // But warn about database sync failure
                return response()->json([
                    'message' => 'User registered in Supabase but failed to sync to database',
                    'access_token' => $accessToken,
                    'user' => [
                        'id' => $userId,
                        'email' => $userEmail,
                        'full_name' => $request->full_name,
                    ],
                    'warning' => 'Database sync failed. Please check database connection.',
                ], 201);
            }

            return response()->json([
                'message' => 'User registered successfully',
                'access_token' => $accessToken,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            try {
                LoginLog::create([
                    'user_id' => null,
                    'provider' => 'email',
                    'success' => false,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } catch (\Exception $logError) {
                Log::error('Failed to create login log: ' . $logError->getMessage());
            }

            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            // Login user in Supabase
            $response = $this->supabaseService->signIn(
                $request->email,
                $request->password
            );

            $accessToken = $response['access_token'];
            $userData = $response['user'];

            // Try to sync user to local database (optional, don't fail if DB is down)
            try {
                $user = User::updateOrCreate(
                    ['id' => $userData['id']],
                    [
                        'email' => $userData['email'],
                        'full_name' => $userData['user_metadata']['full_name'] ?? $userData['email'],
                        'provider' => 'email',
                        'is_active' => true,
                    ]
                );

                // Log successful login
                LoginLog::create([
                    'user_id' => $user->id,
                    'provider' => 'email',
                    'success' => true,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } catch (\Exception $dbError) {
                Log::warning('Database sync failed during login: ' . $dbError->getMessage());
            }

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $accessToken,
                'user' => [
                    'id' => $userData['id'],
                    'email' => $userData['email'],
                    'full_name' => $userData['user_metadata']['full_name'] ?? $userData['email'],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());

            // Try to log failed login (optional, don't fail if DB is down)
            try {
                $user = User::where('email', $request->email)->first();
                LoginLog::create([
                    'user_id' => $user?->id,
                    'provider' => 'email',
                    'success' => false,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } catch (\Exception $dbError) {
                Log::warning('Failed to log login attempt: ' . $dbError->getMessage());
            }

            return response()->json([
                'message' => 'Invalid credentials',
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'full_name' => $user->full_name,
            'provider' => $user->provider,
            'is_active' => $user->is_active,
            'created_at' => $user->created_at,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // In stateless JWT, logout is handled client-side
        // But we can log it if needed
        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}

