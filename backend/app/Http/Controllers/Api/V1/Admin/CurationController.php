<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderCurationRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Services\CurationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Powers both `/admin/new-arrivals` and `/admin/sale` — see `CurationService`'s doc comment for why one controller serves both. */
class CurationController extends Controller
{
    public function __construct(private readonly CurationService $curation) {}

    public function index(Request $request): JsonResponse
    {
        $type = $this->resolveType($request);

        return ApiResponse::success(ProductResource::collection($this->curation->list($type)));
    }

    public function add(Request $request, Product $product): JsonResponse
    {
        $type = $this->resolveType($request);
        $updated = $this->curation->add($type, $product);

        return ApiResponse::success(new ProductResource($updated), 'Added.');
    }

    public function remove(Request $request, Product $product): JsonResponse
    {
        $type = $this->resolveType($request);
        $updated = $this->curation->remove($type, $product);

        return ApiResponse::success(new ProductResource($updated), 'Removed.');
    }

    public function reorder(ReorderCurationRequest $request): JsonResponse
    {
        $this->curation->reorder($request->validated('type'), $request->validated('items'));

        return ApiResponse::success(null, 'Order updated.');
    }

    private function resolveType(Request $request): string
    {
        $type = $request->string('type', 'new_arrivals')->toString();

        abort_unless(in_array($type, ['new_arrivals', 'sale'], true), 422, 'Invalid curation type.');

        return $type;
    }
}
