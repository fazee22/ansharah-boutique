<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private const EAGER = ['category.parent.parent.parent', 'images'];

    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(self::EAGER)
            ->where('status', 'published');

        if ($request->filled('ids')) {
            $ids = array_filter(explode(',', $request->string('ids')->toString()), fn ($id) => is_numeric($id));
            $query->whereIn('id', $ids);
        }

        if ($request->filled('category_path')) {
            $categoryIds = $this->resolveCategoryIdsByPath($request->string('category_path')->toString());
            $query->whereIn('category_id', $categoryIds);
        } elseif ($request->filled('category')) {
            $categoryIds = $this->resolveCategoryIds($request->string('category')->toString());
            $query->whereIn('category_id', $categoryIds);
        }

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(fn ($q) => $q->where('name', 'like', "%{$term}%")->orWhere('sku', 'like', "%{$term}%"));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->float('max_price'));
        }

        if ($request->boolean('in_stock')) {
            $query->where('stock_quantity', '>', 0);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->boolean('new_arrivals')) {
            $query->where('is_new_arrival', true)->orderBy('new_arrival_position');
        }

        if ($request->boolean('sale')) {
            $query->where('is_sale', true)->orderBy('sale_position');
        }

        match ($request->string('sort', 'newest')->toString()) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'featured' => $query->orderByDesc('is_featured')->orderByDesc('created_at'),
            'best-selling' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate($request->integer('per_page', 24));

        return ApiResponse::success(PublicProductResource::collection($products));
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->with(self::EAGER)
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return ApiResponse::success(new PublicProductResource($product));
    }

    private function resolveCategoryIds(string $slug): array
    {
        $root = Category::where('slug', $slug)->first();
        if (! $root) {
            return [-1];
        }

        return $this->collectDescendantIds($root->id);
    }

    private function resolveCategoryIdsByPath(string $path): array
    {
        $segments = array_values(array_filter(explode('/', $path)));
        if ($segments === []) {
            return [-1];
        }

        $parentId = null;
        $current = null;

        foreach ($segments as $segment) {
            $current = Category::where('slug', $segment)->where('parent_id', $parentId)->first();
            if (! $current) {
                return [-1];
            }
            $parentId = $current->id;
        }

        return $this->collectDescendantIds($current->id);
    }

    private function collectDescendantIds(int $rootId): array
    {
        $all = Category::all(['id', 'parent_id']);
        $ids = [$rootId];
        $frontier = [$rootId];

        while ($frontier !== []) {
            $children = $all->filter(fn ($category) => in_array($category->parent_id, $frontier, true));
            $frontier = $children->pluck('id')->all();
            $ids = array_merge($ids, $frontier);
        }

        return $ids;
    }
}