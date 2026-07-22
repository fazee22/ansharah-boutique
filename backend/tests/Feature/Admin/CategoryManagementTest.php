<?php

use App\Models\Category;
use App\Models\User;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\postJson;

it('rejects unauthenticated access to admin categories', function () {
    getJson('/api/v1/admin/categories')->assertUnauthorized();
});

it('rejects a non-admin user', function () {
    $customer = User::factory()->create();
    $token = auth('api')->login($customer);

    getJson('/api/v1/admin/categories', ['Authorization' => "Bearer {$token}"])
        ->assertForbidden();
});

it('lists categories for an admin', function () {
    [, $token] = loginAsAdmin();
    Category::factory()->count(3)->create();

    getJson('/api/v1/admin/categories', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('success', true);
});

it('creates a category with an auto-generated slug', function () {
    [, $token] = loginAsAdmin();

    $response = postJson('/api/v1/admin/categories', [
        'name' => 'Resort Wear',
    ], ['Authorization' => "Bearer {$token}"]);

    $response->assertCreated()->assertJsonPath('data.slug', 'resort-wear');
    expect(Category::where('slug', 'resort-wear')->exists())->toBeTrue();
});

it('refuses to delete a category that still has products', function () {
    [, $token] = loginAsAdmin();
    $category = Category::factory()->create();
    \App\Models\Product::factory()->create(['category_id' => $category->id]);

    deleteJson("/api/v1/admin/categories/{$category->id}", [], ['Authorization' => "Bearer {$token}"])
        ->assertUnprocessable();
});

it('toggles category visibility', function () {
    [, $token] = loginAsAdmin();
    $category = Category::factory()->create(['is_visible' => true]);

    patchJson("/api/v1/admin/categories/{$category->id}/toggle-visibility", [], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.isVisible', false);
});
