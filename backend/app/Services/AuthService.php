<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

/**
 * Encapsulates auth business logic so `AuthController` stays a thin
 * HTTP adapter. Keeping this in a service (rather than the
 * controller or the model) is what lets the same registration/login
 * flow be reused from, e.g., a future admin-invite console command
 * without duplicating logic.
 */
class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'customer',
        ]);

        $token = JWTAuth::fromUser($user);

        return $this->buildSession($user, $token);
    }

    public function attemptLogin(string $email, string $password): ?array
    {
        $credentials = ['email' => $email, 'password' => $password];

        if (! $token = JWTAuth::attempt($credentials)) {
            return null;
        }

        /** @var User $user */
        $user = auth('api')->user();

        return $this->buildSession($user, $token);
    }

    public function refresh(): array
    {
        $newToken = JWTAuth::refresh(JWTAuth::getToken());
        /** @var User $user */
        $user = auth('api')->setToken($newToken)->user();

        return $this->buildSession($user, $newToken);
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    private function buildSession(User $user, string $token): array
    {
        $ttlMinutes = auth('api')->factory()->getTTL();

        return [
            'user' => $user,
            'accessToken' => $token,
            'expiresAt' => now()->addMinutes($ttlMinutes)->toIso8601String(),
        ];
    }
}
