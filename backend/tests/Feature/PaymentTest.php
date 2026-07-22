<?php

use App\Models\Order;
use App\Models\Payment;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

it('lists payment methods with cod always configured', function () {
    getJson('/api/v1/payments/methods')
        ->assertOk()
        ->assertJsonFragment(['key' => 'cod', 'configured' => true]);
});

it('initiates a cash on delivery payment and marks the order paid', function () {
    $order = Order::factory()->create(['payment_status' => 'unpaid']);

    postJson('/api/v1/payments/initiate', [
        'order_number' => $order->order_number,
        'email' => $order->customer_email,
        'gateway' => 'cod',
    ])->assertOk()->assertJsonPath('data.status', 'succeeded');

    expect($order->fresh()->payment_status)->toBe('paid');
    expect(Payment::where('order_id', $order->id)->where('gateway', 'cod')->exists())->toBeTrue();
});

it('rejects initiating payment with an email that does not match the order', function () {
    $order = Order::factory()->create();

    postJson('/api/v1/payments/initiate', [
        'order_number' => $order->order_number,
        'email' => 'someone-else@example.com',
        'gateway' => 'cod',
    ])->assertForbidden();
});

it('refuses to initiate an unconfigured gateway', function () {
    $order = Order::factory()->create();

    postJson('/api/v1/payments/initiate', [
        'order_number' => $order->order_number,
        'email' => $order->customer_email,
        'gateway' => 'stripe',
    ])->assertUnprocessable();
});

it('rejects an unknown gateway key at validation time', function () {
    $order = Order::factory()->create();

    postJson('/api/v1/payments/initiate', [
        'order_number' => $order->order_number,
        'email' => $order->customer_email,
        'gateway' => 'not-a-real-gateway',
    ])->assertUnprocessable();
});
