<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Forces every API request to negotiate a JSON response, regardless
 * of the client's Accept header. This keeps error rendering
 * (validation, auth, 404s — see bootstrap/app.php withExceptions)
 * consistently JSON for a pure REST API with no server-rendered views.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
