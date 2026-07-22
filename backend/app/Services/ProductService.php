<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function create(array $data): Product
    {
        $data['slug'] = $this->resolveSlug($data['name'], $data['slug'] ?? null);

        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        if (array_key_exists('name', $data) && empty($data['slug'])) {
            $data['slug'] = $this->resolveSlug($data['name'], null, $product->id);
        }

        $product->update($data);

        return $product->fresh();
    }

    /**
     * Copies every scalar field plus every image (re-uploading each
     * one under the new product's own Cloudinary folder, not just
     * pointing two products at the same asset — so deleting an image
     * on the duplicate can never silently remove it from the
     * original). The duplicate always starts as a `draft`, regardless
     * of the source product's status, so duplicating a live product
     * can never accidentally publish a half-edited copy.
     */
    public function duplicate(Product $product): Product
    {
        return DB::transaction(function () use ($product) {
            $copy = $product->replicate(['slug', 'sku']);
            $copy->name = "{$product->name} (Copy)";
            $copy->slug = $this->resolveSlug($copy->name, null);
            $copy->sku = $this->resolveSku($product->sku);
            $copy->status = 'draft';
            $copy->save();

            foreach ($product->load('images')->images as $image) {
                $copy->images()->create([
                    'url' => $image->url,
                    'public_id' => $image->public_id,
                    'position' => $image->position,
                    'is_featured' => $image->is_featured,
                ]);
            }

            return $copy->fresh('images');
        });
    }

    /**
     * @param  int[]  $productIds
     */
    public function bulkUpdateStatus(array $productIds, string $status): int
    {
        return Product::whereIn('id', $productIds)->update(['status' => $status]);
    }

    /**
     * @param  int[]  $productIds
     */
    public function bulkUpdateCategory(array $productIds, int $categoryId): int
    {
        return Product::whereIn('id', $productIds)->update(['category_id' => $categoryId]);
    }

    /**
     * @param  int[]  $productIds
     */
    public function bulkDelete(array $productIds): int
    {
        return Product::whereIn('id', $productIds)->delete();
    }

    private function resolveSlug(string $name, ?string $requestedSlug, ?int $ignoreId = null): string
    {
        $base = Str::slug($requestedSlug ?: $name);
        $slug = $base;
        $suffix = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->exists()
        ) {
            $suffix++;
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
    }

    private function resolveSku(string $sourceSku): string
    {
        $base = "{$sourceSku}-COPY";
        $sku = $base;
        $suffix = 1;

        while (Product::where('sku', $sku)->exists()) {
            $suffix++;
            $sku = "{$base}-{$suffix}";
        }

        return $sku;
    }
}
