<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $session = $this->authService->register($request->validated());

        return ApiResponse::success(
            $this->formatSession($session),
            'Account created successfully.',
            Response::HTTP_CREATED,
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $session = $this->authService->attemptLogin(
            $request->validated('email'),
            $request->validated('password'),
        );

        if (! $session) {
            return ApiResponse::error('These credentials do not match our records.', Response::HTTP_UNAUTHORIZED);
        }

        return ApiResponse::success($this->formatSession($session), 'Logged in successfully.');
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return ApiResponse::success(null, 'Logged out successfully.');
    }

    public function refresh(): JsonResponse
    {
        $session = $this->authService->refresh();

        return ApiResponse::success($this->formatSession($session), 'Token refreshed.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(new UserResource($request->user()), 'Current user retrieved.');
    }

    private function formatSession(array $session): array
    {
        return [
            'user' => new UserResource($session['user']),
            'accessToken' => $session['accessToken'],
            'expiresAt' => $session['expiresAt'],
        ];
    }
}
