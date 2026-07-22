<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('creates a product with an auto-generated slug', function () {
    [, $token] = loginAsAdmin();
    $category = Category::factory()->create();

    $response = postJson('/api/v1/admin/products', [
        'category_id' => $category->id,
        'name' => 'Embroidered Winter Set',
        'sku' => 'VR-TEST-0001',
        'price' => 8500,
        'stock_quantity' => 12,
        'status' => 'draft',
    ], ['Authorization' => "Bearer {$token}"]);

    $response->assertCreated()
        ->assertJsonPath('data.slug', 'embroidered-winter-set')
        ->assertJsonPath('data.sku', 'VR-TEST-0001');
});

it('rejects a sale price that is not lower than the regular price', function () {
    [, $token] = loginAsAdmin();
    $category = Category::factory()->create();

    postJson('/api/v1/admin/products', [
        'category_id' => $category->id,
        'name' => 'Invalid Sale Product',
        'sku' => 'VR-TEST-0002',
        'price' => 5000,
        'sale_price' => 6000,
        'stock_quantity' => 5,
        'status' => 'draft',
    ], ['Authorization' => "Bearer {$token}"])->assertUnprocessable();
});

it('updates a product', function () {
    [, $token] = loginAsAdmin();
    $product = Product::factory()->create(['name' => 'Original Name']);

    putJson("/api/v1/admin/products/{$product->id}", [
        'name' => 'Updated Name',
    ], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Name');
});

it('duplicates a product as a draft with its own SKU and images', function () {
    [, $token] = loginAsAdmin();
    $product = Product::factory()->create(['status' => 'published']);
    $product->images()->create(['url' => 'https://example.test/a.jpg', 'position' => 1, 'is_featured' => true]);

    $response = postJson("/api/v1/admin/products/{$product->id}/duplicate", [], ['Authorization' => "Bearer {$token}"]);

    $response->assertCreated()
        ->assertJsonPath('data.status', 'draft')
        ->assertJsonCount(1, 'data.images');

    expect($response->json('data.sku'))->not->toBe($product->sku);
});

it('applies a bulk publish action', function () {
    [, $token] = loginAsAdmin();
    $products = Product::factory()->count(3)->draft()->create();

    postJson('/api/v1/admin/products/bulk-action', [
        'product_ids' => $products->pluck('id')->all(),
        'action' => 'publish',
    ], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.affected', 3);

    expect(Product::where('status', 'published')->count())->toBe(3);
});

it('uploads a product image to the cloudinary disk', function () {
    Storage::fake('cloudinary');
    [, $token] = loginAsAdmin();
    $product = Product::factory()->create();

    $response = postJson(
        "/api/v1/admin/products/{$product->id}/images",
        ['image' => UploadedFile::fake()->image('lawn.jpg')],
        ['Authorization' => "Bearer {$token}"],
    );

    $response->assertCreated()->assertJsonPath('data.isFeatured', true);
});

it('refuses to delete a product image below the minimum of one', function () {
    [, $token] = loginAsAdmin();
    $product = Product::factory()->create();
    $image = $product->images()->create(['url' => 'https://example.test/a.jpg', 'position' => 1, 'is_featured' => true]);

    deleteJson("/api/v1/admin/products/{$product->id}/images/{$image->id}", [], ['Authorization' => "Bearer {$token}"])
        ->assertUnprocessable();
});
