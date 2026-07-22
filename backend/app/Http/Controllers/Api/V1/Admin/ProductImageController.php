<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderProductImagesRequest;
use App\Http\Requests\Admin\UploadProductImageRequest;
use App\Http\Resources\Admin\ProductImageResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ProductImageController extends Controller
{
    public function __construct(private readonly ProductImageService $images) {}

    /**
     * Single-file upload per request — the frontend's drag-and-drop
     * zone (`components/admin/products/image-manager.tsx`) fires one
     * request per file so each upload's own progress/error is
     * independent; dropping 6 images never means one failure fails
     * all 6.
     */
    public function store(UploadProductImageRequest $request, Product $product): JsonResponse
    {
        $image = $this->images->upload($product, $request->file('image'), $request->boolean('is_featured'));

        return ApiResponse::success(new ProductImageResource($image), 'Image uploaded.', Response::HTTP_CREATED);
    }

    public function destroy(Product $product, ProductImage $image): JsonResponse
    {
        $this->images->delete($product, $image);

        return ApiResponse::success(null, 'Image deleted.');
    }

    public function setFeatured(Product $product, ProductImage $image): JsonResponse
    {
        $this->images->setFeatured($product, $image);

        return ApiResponse::success(new ProductImageResource($image->fresh()), 'Featured image updated.');
    }

    public function reorder(ReorderProductImagesRequest $request, Product $product): JsonResponse
    {
        $this->images->reorder($product, $request->validated('items'));

        return ApiResponse::success(
            ProductImageResource::collection($product->images()->get()),
            'Image order updated.',
        );
    }
}
