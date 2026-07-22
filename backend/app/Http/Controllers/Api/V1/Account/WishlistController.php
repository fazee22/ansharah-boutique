<?php

namespace App\Http\Controllers\Api\V1\Account;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Services\WishlistService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function __construct(private readonly WishlistService $wishlist) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success(ProductResource::collection($this->wishlist->list($request->user())));
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $this->wishlist->add($request->user(), $product->id);

        return ApiResponse::success(null, 'Added to wishlist.');
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->wishlist->remove($request->user(), $product->id);

        return ApiResponse::success(null, 'Removed from wishlist.');
    }

    /**
     * Called once, right after a customer logs in, with whatever
     * product ids were in their guest (localStorage) wishlist — folds
     * them into the real account wishlist rather than discarding them.
     */
    public function merge(Request $request): JsonResponse
    {
        $productIds = array_map('intval', (array) $request->input('product_ids', []));
        $this->wishlist->merge($request->user(), $productIds);

        return ApiResponse::success(ProductResource::collection($this->wishlist->list($request->user())), 'Wishlist synced.');
    }
}
