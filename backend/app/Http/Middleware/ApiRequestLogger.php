<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Structured, one-line-per-request API logging — method, path, status,
 * duration, and the authenticated user id (if any), written to the
 * `api` log channel (see `config/logging.php`) rather than the
 * default `stack` channel, so API traffic can be inspected/rotated
 * independently of application error logs. Deliberately never logs
 * request bodies — a login/register/change-password request body
 * contains a plaintext password, and no request log is worth risking
 * that ending up on disk.
 */
class ApiRequestLogger
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);

        /** @var Response $response */
        $response = $next($request);

        $durationMs = round((microtime(true) - $startedAt) * 1000, 1);

        Log::channel('api')->info(sprintf('%s %s', $request->method(), $request->path()), [
            'status' => $response->getStatusCode(),
            'duration_ms' => $durationMs,
            'user_id' => $request->user('api')?->id,
            'ip' => $request->ip(),
        ]);

        return $response;
    }
}
