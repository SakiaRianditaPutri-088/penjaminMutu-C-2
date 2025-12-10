<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected $client;
    protected $url;
    protected $serviceRoleKey;
    protected $jwksUrl;

    public function __construct()
    {
        $this->url = config('supabase.url');
        $this->jwksUrl = config('supabase.jwks_url');
    }

    public function createUser(string $email, string $password, string $fullName): array
    {
        try {
            // Use public signup endpoint instead of admin endpoint
            // This doesn't require service_role key
            $client = new Client([
                'base_uri' => $this->url,
                'headers' => [
                    'apikey' => config('supabase.anon_key'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            $response = $client->post('/auth/v1/signup', [
                'json' => [
                    'email' => $email,
                    'password' => $password,
                    'data' => [
                        'full_name' => $fullName,
                    ],
                    'options' => [
                        'emailRedirectTo' => null,
                    ],
                ],
            ]);

            $result = json_decode($response->getBody()->getContents(), true);
            
            // Check if response has error
            if (isset($result['error']) || isset($result['msg'])) {
                $errorMsg = $result['msg'] ?? $result['error'] ?? 'Failed to create user';
                Log::error('Supabase signup error: ' . $errorMsg, ['response' => $result]);
                throw new \Exception($errorMsg);
            }
            
            // Signup endpoint returns user and session
            // Return full response including session/token
            return $result;
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $response = $e->getResponse();
            if ($response) {
                $body = json_decode($response->getBody()->getContents(), true);
                $errorMsg = $body['msg'] ?? $body['error'] ?? $body['message'] ?? $e->getMessage();
                
                // Handle specific Supabase errors
                if (isset($body['error_code'])) {
                    switch ($body['error_code']) {
                        case 'email_address_invalid':
                            $errorMsg = 'Email address is invalid or already registered';
                            break;
                        case 'signup_disabled':
                            $errorMsg = 'Signup is currently disabled';
                            break;
                        case 'user_already_registered':
                            $errorMsg = 'This email is already registered. Please login instead.';
                            break;
                    }
                }
                
                Log::error('Supabase create user failed: ' . $errorMsg, ['response' => $body]);
                throw new \Exception($errorMsg);
            }
            throw new \Exception('Failed to create user: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Supabase create user failed: ' . $e->getMessage());
            throw new \Exception('Failed to create user: ' . $e->getMessage());
        }
    }

    public function signIn(string $email, string $password): array
    {
        try {
            $client = new Client([
                'base_uri' => $this->url,
                'headers' => [
                    'apikey' => config('supabase.anon_key'),
                    'Content-Type' => 'application/json',
                ],
            ]);

            $response = $client->post('/auth/v1/token?grant_type=password', [
                'json' => [
                    'email' => $email,
                    'password' => $password,
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Supabase sign in failed: ' . $e->getMessage());
            throw new \Exception('Invalid credentials');
        }
    }

    public function verifyToken(string $token): ?array
    {
        try {
            // Use Supabase API to verify token and get user
            $client = new Client([
                'base_uri' => $this->url,
                'headers' => [
                    'apikey' => config('supabase.anon_key'),
                    'Authorization' => 'Bearer ' . $token,
                ],
            ]);

            $response = $client->get('/auth/v1/user');

            if ($response->getStatusCode() === 200) {
                $userData = json_decode($response->getBody()->getContents(), true);
                
                // Decode token to get payload (for expiration check)
                $parts = explode('.', $token);
                if (count($parts) === 3) {
                    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
                    
                    // Check expiration
                    if (isset($payload['exp']) && $payload['exp'] < time()) {
                        return null;
                    }
                    
                    // Merge user data with payload
                    return array_merge($payload, [
                        'user' => $userData,
                        'email' => $userData['email'] ?? $payload['email'] ?? null,
                        'sub' => $userData['id'] ?? $payload['sub'] ?? null,
                    ]);
                }
                
                return [
                    'user' => $userData,
                    'email' => $userData['email'] ?? null,
                    'sub' => $userData['id'] ?? null,
                ];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Token verification failed: ' . $e->getMessage());
            return null;
        }
    }
}

