<?php

use App\Models\Order;
use App\Models\User;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\postJson;

it('rejects unauthenticated access to admin orders', function () {
    getJson('/api/v1/admin/orders')->assertUnauthorized();
});

it('lists orders for an admin', function () {
    [, $token] = loginAsAdmin();
    Order::factory()->count(3)->create();

    getJson('/api/v1/admin/orders', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('success', true);
});

it('updates an order status and logs it to the timeline', function () {
    [, $token] = loginAsAdmin();
    $order = Order::factory()->create(['status' => 'pending']);

    patchJson("/api/v1/admin/orders/{$order->id}/status", [
        'status' => 'confirmed',
        'note' => 'Payment verified.',
    ], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.status', 'confirmed')
        ->assertJsonCount(1, 'data.statusHistory');
});

it('rejects an invalid order status', function () {
    [, $token] = loginAsAdmin();
    $order = Order::factory()->create();

    patchJson("/api/v1/admin/orders/{$order->id}/status", [
        'status' => 'not-a-real-status',
    ], ['Authorization' => "Bearer {$token}"])->assertUnprocessable();
});

it('adds a note to an order', function () {
    [, $token] = loginAsAdmin();
    $order = Order::factory()->create();

    postJson("/api/v1/admin/orders/{$order->id}/notes", [
        'body' => 'Called customer to confirm address.',
    ], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonCount(1, 'data.notes');
});

it('lists customers for an admin', function () {
    [, $token] = loginAsAdmin();
    User::factory()->count(3)->create(['role' => 'customer']);

    getJson('/api/v1/admin/customers', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('success', true);
});

it('blocks a customer account', function () {
    [, $token] = loginAsAdmin();
    $customer = User::factory()->create(['role' => 'customer', 'account_status' => 'active']);

    patchJson("/api/v1/admin/customers/{$customer->id}/status", [
        'account_status' => 'blocked',
    ], ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonPath('data.accountStatus', 'blocked');
});
