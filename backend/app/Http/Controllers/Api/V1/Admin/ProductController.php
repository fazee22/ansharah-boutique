<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkProductActionRequest;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Services\ProductImageService;
use App\Services\ProductService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $products,
        private readonly ProductImageService $images,
    ) {}

    /**
     * Supports the admin product table's search, filters, sort, and
     * pagination in one endpoint — `?search=`, `?category_id=`,
     * `?status=`, `?featured=1`, `?sale=1`, `?sort=`.
     */
    public function index(Request $request): JsonResponse
    {
        $sortMap = [
            'name' => ['name', 'asc'],
            'price_asc' => ['price', 'asc'],
            'price_desc' => ['price', 'desc'],
            'stock' => ['stock_quantity', 'asc'],
            'newest' => ['created_at', 'desc'],
            'oldest' => ['created_at', 'asc'],
        ];
        [$sortColumn, $sortDirection] = $sortMap[$request->string('sort')->toString()] ?? $sortMap['newest'];

        $products = Product::query()
            ->with(['category', 'images'])
            ->search($request->string('search')->toString() ?: null)
            ->when($request->filled('category_id'), fn ($query) => $query->where('category_id', $request->integer('category_id')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->boolean('featured'), fn ($query) => $query->where('is_featured', true))
            ->when($request->boolean('sale'), fn ($query) => $query->where('is_sale', true))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->products->create($request->validated());

        return ApiResponse::success(
            new ProductResource($product->load(['category', 'images'])),
            'Product created.',
            Response::HTTP_CREATED,
        );
    }

    public function show(Product $product): JsonResponse
    {
        return ApiResponse::success(new ProductResource($product->load(['category', 'images'])));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $updated = $this->products->update($product, $request->validated());

        return ApiResponse::success(new ProductResource($updated->load(['category', 'images'])), 'Product updated.');
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->images->deleteAllForProduct($product->load('images'));
        $product->delete();

        return ApiResponse::success(null, 'Product deleted.');
    }

    public function duplicate(Product $product): JsonResponse
    {
        $copy = $this->products->duplicate($product);

        return ApiResponse::success(new ProductResource($copy), 'Product duplicated.', Response::HTTP_CREATED);
    }

    public function bulkAction(BulkProductActionRequest $request): JsonResponse
    {
        $ids = $request->validated('product_ids');
        $action = $request->validated('action');

        $affected = match ($action) {
            'delete' => $this->products->bulkDelete($ids),
            'publish' => $this->products->bulkUpdateStatus($ids, 'published'),
            'draft' => $this->products->bulkUpdateStatus($ids, 'draft'),
            'hide' => $this->products->bulkUpdateStatus($ids, 'hidden'),
            'change_category' => $this->products->bulkUpdateCategory($ids, (int) $request->validated('category_id')),
        };

        return ApiResponse::success(['affected' => $affected], 'Bulk action applied.');
    }
}
