<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Lightweight liveness + dependency check, used by the frontend setup
 * verification step, uptime monitors, and load balancer health
 * checks. Deliberately has no auth requirement.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $databaseConnected = true;

        try {
            DB::connection()->getPdo();
        } catch (\Throwable) {
            $databaseConnected = false;
        }

        return ApiResponse::success([
            'status' => 'ok',
            'database' => $databaseConnected ? 'connected' : 'unreachable',
            'timestamp' => now()->toIso8601String(),
        ], 'Service is healthy.');
    }
}
