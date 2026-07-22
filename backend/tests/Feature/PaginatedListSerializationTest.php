<?php

use App\Models\Category;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use function Pest\Laravel\getJson;

/**
 * Regression coverage for a systemic Phase 12 bug: six paginated list
 * endpoints (`Admin\{Product,Category,Customer,Newsletter,Order}Controller`
 * and `Account\OrderController`) were passing a raw Eloquent paginator
 * straight to `ApiResponse::success()` instead of wrapping it in their
 * own `*Resource::collection()` first. `ApiResponse::success()` only
 * ever built camelCase pagination *meta* — the list *items* serialized
 * using raw database column names (`account_status`, not
 * `accountStatus`), silently breaking every admin table and the
 * customer's own Order History. Fixed in `ApiResponse::success()`
 * (now paginator-aware only through a `Resource::collection()` input)
 * plus all six call sites. These tests assert the camelCase shape
 * directly so this class of bug can't silently return.
 */
it('returns camelCase fields for the admin product list', function () {
    [, $token] = loginAsAdmin();
    Product::factory()->count(2)->create();

    $response = getJson('/api/v1/admin/products', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'name', 'slug', 'salePrice', 'isFeatured', 'isNewArrival'])
        ->not->toHaveKey('sale_price');
});

it('returns camelCase fields for the admin category list', function () {
    [, $token] = loginAsAdmin();
    Category::factory()->count(2)->create();

    $response = getJson('/api/v1/admin/categories', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'name', 'slug', 'isVisible', 'productCount'])
        ->not->toHaveKey('is_visible');
});

it('returns camelCase fields for the admin customer list', function () {
    [, $token] = loginAsAdmin();
    User::factory()->count(2)->create();

    $response = getJson('/api/v1/admin/customers', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'name', 'email', 'accountStatus', 'ordersCount', 'createdAt'])
        ->not->toHaveKey('account_status');
});

it('returns camelCase fields for the admin newsletter subscriber list', function () {
    [, $token] = loginAsAdmin();
    NewsletterSubscriber::factory()->count(2)->create();

    $response = getJson('/api/v1/admin/newsletter-subscribers', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'email', 'source', 'subscribedAt'])
        ->not->toHaveKey('subscribed_at');
});

it('returns camelCase fields for the admin order list', function () {
    [, $token] = loginAsAdmin();
    Order::factory()->count(2)->create();

    $response = getJson('/api/v1/admin/orders', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'orderNumber', 'paymentStatus', 'createdAt'])
        ->not->toHaveKey('order_number');
});

it('returns camelCase fields for a customer own order history list', function () {
    [$user, $token] = loginAsCustomer();
    Order::factory()->count(2)->create(['user_id' => $user->id]);

    $response = getJson('/api/v1/account/orders', ['Authorization' => "Bearer {$token}"])->assertOk();

    expect($response->json('data.0'))->toHaveKeys(['id', 'orderNumber', 'createdAt'])
        ->not->toHaveKey('order_number');
});
