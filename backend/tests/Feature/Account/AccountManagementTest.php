<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

it('rejects unauthenticated access to account endpoints', function () {
    getJson('/api/v1/account/profile')->assertUnauthorized();
    getJson('/api/v1/account/wishlist')->assertUnauthorized();
    getJson('/api/v1/account/orders')->assertUnauthorized();
});

it('lets a customer view and update their profile', function () {
    [$user, $token] = loginAsCustomer();

    getJson('/api/v1/account/profile', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.email', $user->email);

    putJson('/api/v1/account/profile', ['name' => 'Updated Name', 'email' => $user->email], [
        'Authorization' => "Bearer {$token}",
    ])->assertOk()->assertJsonPath('data.name', 'Updated Name');
});

it('lets a customer change their password with the correct current password', function () {
    [, $token] = loginAsCustomer();

    putJson('/api/v1/account/password', [
        'current_password' => 'password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ], ['Authorization' => "Bearer {$token}"])->assertOk();
});

it('rejects a password change with the wrong current password', function () {
    [, $token] = loginAsCustomer();

    putJson('/api/v1/account/password', [
        'current_password' => 'wrong-password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ], ['Authorization' => "Bearer {$token}"])->assertUnprocessable();
});

it('lets a customer manage their own addresses only', function () {
    [$user, $token] = loginAsCustomer();
    $other = User::factory()->create();
    $othersAddress = Address::factory()->create(['user_id' => $other->id]);

    postJson('/api/v1/account/addresses', [
        'type' => 'shipping',
        'full_name' => $user->name,
        'phone' => '03001234567',
        'line1' => '123 Test Street',
        'city' => 'Karachi',
        'country' => 'Pakistan',
        'is_default' => true,
    ], ['Authorization' => "Bearer {$token}"])->assertOk();

    // Can't update or delete another customer's address.
    putJson("/api/v1/account/addresses/{$othersAddress->id}", ['city' => 'Lahore'], [
        'Authorization' => "Bearer {$token}",
    ])->assertForbidden();

    deleteJson("/api/v1/account/addresses/{$othersAddress->id}", [], [
        'Authorization' => "Bearer {$token}",
    ])->assertForbidden();
});

it('only shows a customer their own orders', function () {
    [$user, $token] = loginAsCustomer();
    $other = User::factory()->create();
    Order::factory()->create(['user_id' => $user->id]);
    $othersOrder = Order::factory()->create(['user_id' => $other->id]);

    getJson('/api/v1/account/orders', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonCount(1, 'data');

    getJson("/api/v1/account/orders/{$othersOrder->id}", ['Authorization' => "Bearer {$token}"])
        ->assertNotFound();
});

it('lets a customer add, list, and remove wishlist items', function () {
    [, $token] = loginAsCustomer();
    $product = Product::factory()->create(['status' => 'published']);

    postJson("/api/v1/account/wishlist/{$product->id}", [], ['Authorization' => "Bearer {$token}"])->assertOk();

    getJson('/api/v1/account/wishlist', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonCount(1, 'data');

    deleteJson("/api/v1/account/wishlist/{$product->id}", [], ['Authorization' => "Bearer {$token}"])->assertOk();

    getJson('/api/v1/account/wishlist', ['Authorization' => "Bearer {$token}"])->assertJsonCount(0, 'data');
});
