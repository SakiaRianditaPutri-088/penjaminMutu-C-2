<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\SupabaseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SupabaseJwtMiddleware
{
    protected $supabaseService;

    public function __construct(SupabaseService $supabaseService)
    {
        $this->supabaseService = $supabaseService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Unauthorized. Token not provided.',
            ], 401);
        }

        // Verify token with Supabase
        $payload = $this->supabaseService->verifyToken($token);

        if (!$payload) {
            return response()->json([
                'message' => 'Unauthorized. Invalid token.',
            ], 401);
        }

        // Extract user data
        $userId = $payload['sub'] ?? $payload['user']['id'] ?? null;
        $userData = $payload['user'] ?? [];
        $email = $payload['email'] ?? $userData['email'] ?? '';
        $fullName = $userData['user_metadata']['full_name'] ?? $payload['user_metadata']['full_name'] ?? $email;
        $provider = $payload['iss'] ?? 'email';

        if (!$userId) {
            return response()->json([
                'message' => 'Unauthorized. Invalid token data.',
            ], 401);
        }

        // Get or create user
        $user = User::firstOrCreate(
            ['id' => $userId],
            [
                'email' => $email,
                'full_name' => $fullName,
                'provider' => $provider,
                'is_active' => true,
            ]
        );

        // Update user if needed
        if ($user->email !== $email || $user->full_name !== $fullName) {
            $user->update([
                'email' => $email,
                'full_name' => $fullName,
            ]);
        }

        // Set authenticated user
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}

