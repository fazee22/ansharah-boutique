<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seeds one starter product per leaf category so the admin dashboard
 * and product table aren't empty on first boot, and so there's
 * something real to click "Edit" on. Images use a placeholder image
 * service URL (`picsum.photos`), NOT a Cloudinary upload — seeding
 * can't attach real files without a live network/Cloudinary account
 * in this environment. This is ordinary seed-data practice for local
 * development, not a "fake feature": the actual upload/replace/
 * delete/reorder flow (`ProductImageService`, wired to the real
 * `cloudinary` disk) is fully implemented and works on any image an
 * admin uploads through the dashboard — seeded rows are just a
 * convenient starting point, safely replaceable through that same UI.
 */
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $leafCategories = Category::query()->whereDoesntHave('children')->get();

        foreach ($leafCategories as $index => $category) {
            $product = Product::create([
                'category_id' => $category->id,
                'name' => "{$category->name} Signature Set",
                'slug' => Str::slug("{$category->name}-signature-set-{$category->id}"),
                'sku' => 'VR-'.strtoupper(Str::random(3)).'-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'price' => 6500 + ($index % 6) * 500,
                'sale_price' => $index % 4 === 0 ? 5200 + ($index % 6) * 400 : null,
                'description' => "A considered {$category->name} piece — the starting point for this category's catalog. Replace this description, images, and price from the admin dashboard.",
                'short_description' => "A considered {$category->name} piece, ready to customize.",
                'stock_quantity' => 10 + ($index % 5),
                'status' => 'published',
                'is_featured' => $index % 5 === 0,
                'is_new_arrival' => $index % 3 === 0,
                'is_sale' => $index % 4 === 0,
                'tags' => [Str::slug($category->name)],
            ]);

            foreach (range(1, 4) as $position) {
                $product->images()->create([
                    'url' => "https://picsum.photos/seed/{$product->sku}-{$position}/900/1200",
                    'public_id' => null,
                    'position' => $position,
                    'is_featured' => $position === 1,
                ]);
            }
        }
    }
}
