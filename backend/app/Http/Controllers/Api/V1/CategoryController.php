<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CategoryResource;
use App\Models\Category;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('tree')) {
            $tree = Category::query()
                ->whereNull('parent_id')
                ->where('is_visible', true)
                ->with(['children' => fn ($query) => $query->where('is_visible', true)->orderBy('position'),
                    'children.children' => fn ($query) => $query->where('is_visible', true)->orderBy('position'),
                ])
                ->orderBy('position')
                ->get();

            return ApiResponse::success(CategoryResource::collection($tree));
        }

        $categories = Category::query()
            ->whereNull('parent_id')
            ->where('is_visible', true)
            ->withCount('products')
            ->orderBy('position')
            ->get();

        return ApiResponse::success(CategoryResource::collection($categories));
    }
}