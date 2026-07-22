<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

/**
 * Standard success/error envelope for every API response, matching
 * `frontend/src/types/api.ts`. Controllers should return through this
 * class rather than calling `response()->json()` directly, so the
 * contract can never drift between endpoints.
 *
 * **Paginated lists must be passed as `SomeResource::collection($paginator)`**,
 * never a raw `$paginator` — a raw Eloquent model serializes using its
 * actual database column names (`account_status`, `created_at`), not
 * the camelCase shape every `*Resource` class (and every frontend type)
 * expects. This class detects the `Resource::collection()` case and
 * extracts pagination meta from the paginator underneath it; passing a
 * bare paginator still "works" (kept for defensive compatibility) but
 * silently produces snake_case items, which is exactly the bug this
 * class exists to make impossible to write by accident.
 */
class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Request was successful.',
        int $status = Response::HTTP_OK,
    ): JsonResponse {
        $meta = null;
        $responseData = $data;

        if ($data instanceof AnonymousResourceCollection && $data->resource instanceof LengthAwarePaginator) {
            $paginator = $data->resource;
            $responseData = $data->collection
                ->map(fn (JsonResource $resource) => $resource->resolve(request()))
                ->all();
            $meta = self::paginationMeta($paginator);
        } elseif ($data instanceof LengthAwarePaginator) {
            // Defensive fallback only — every call site in this codebase
            // passes a Resource collection instead (see class doc comment).
            $responseData = $data->items();
            $meta = self::paginationMeta($data);
        }

        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $responseData,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    public static function error(
        string $message = 'Something went wrong.',
        int $status = Response::HTTP_BAD_REQUEST,
        ?array $errors = null,
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    private static function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'currentPage' => $paginator->currentPage(),
            'perPage' => $paginator->perPage(),
            'total' => $paginator->total(),
            'lastPage' => $paginator->lastPage(),
        ];
    }
}
