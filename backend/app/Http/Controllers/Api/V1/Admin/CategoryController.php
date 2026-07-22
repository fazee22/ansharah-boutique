<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderCategoriesRequest;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\Admin\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Support\ApiResponse;
use App\Support\CloudinaryUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\File;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categories) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('tree')) {
            return ApiResponse::success(CategoryResource::collection($this->categories->tree()));
        }

        $categories = Category::query()
            ->withCount('products')
            ->when($request->filled('parent_id'), fn ($query) => $query->where('parent_id', $request->integer('parent_id')))
            ->when($request->filled('search'), fn ($query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->orderBy('position')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(CategoryResource::collection($categories));
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categories->create($request->validated());

        return ApiResponse::success(new CategoryResource($category), 'Category created.', Response::HTTP_CREATED);
    }

    public function show(Category $category): JsonResponse
    {
        return ApiResponse::success(new CategoryResource($category->load('children')));
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $updated = $this->categories->update($category, $request->validated());

        return ApiResponse::success(new CategoryResource($updated), 'Category updated.');
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->categories->delete($category);

        return ApiResponse::success(null, 'Category deleted.');
    }

    public function toggleVisibility(Category $category): JsonResponse
    {
        $category->update(['is_visible' => ! $category->is_visible]);

        return ApiResponse::success(new CategoryResource($category), 'Visibility updated.');
    }

    public function uploadImage(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'image' => ['required', File::image()->max(8 * 1024)],
        ]);

        $uploaded = CloudinaryUploader::upload($request->file('image'), 'categories');

        $category->update(['image_url' => $uploaded['url']]);

        return ApiResponse::success(new CategoryResource($category->fresh()), 'Image uploaded.');
    }

    public function reorder(ReorderCategoriesRequest $request): JsonResponse
    {
        $this->categories->reorder($request->validated('items'));

        return ApiResponse::success(null, 'Order updated.');
    }
}