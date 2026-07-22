<?php

use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

function validCheckoutPayload(array $overrides = []): array
{
    return array_merge([
        'customer_name' => 'Ayesha Khan',
        'customer_email' => 'ayesha@example.com',
        'customer_phone' => '03001234567',
        'payment_method' => 'cod',
        'shipping_fee' => 250,
        'currency' => 'PKR',
        'shipping_address' => [
            'fullName' => 'Ayesha Khan',
            'phone' => '03001234567',
            'line1' => '12 Clifton Road',
            'city' => 'Karachi',
            'country' => 'Pakistan',
        ],
        'items' => [
            ['name' => 'Embroidered Lawn 2-Piece', 'sku' => 'VR-EL-001', 'unit_price' => 6500, 'quantity' => 1],
            ['name' => 'Printed Lawn 3-Piece', 'sku' => 'VR-PL-002', 'unit_price' => 8200, 'quantity' => 2],
        ],
    ], $overrides);
}

it('places a real order from checkout for a guest and sends a confirmation email', function () {
    Mail::fake();

    $response = postJson('/api/v1/orders', validCheckoutPayload())->assertCreated();

    $orderNumber = $response->json('data.orderNumber');
    $order = Order::where('order_number', $orderNumber)->first();

    expect($order)->not->toBeNull();
    expect($order->user_id)->toBeNull();
    expect($order->status)->toBe('pending');
    expect($order->payment_status)->toBe('unpaid');
    expect((float) $order->subtotal)->toBe(6500.0 + 8200.0 * 2);
    expect((float) $order->total)->toBe((float) $order->subtotal + 250.0);
    expect($order->items)->toHaveCount(2);
    expect($order->items->first()->product_id)->toBeNull();
    expect($order->statusHistory)->toHaveCount(1);

    Mail::assertQueued(OrderConfirmationMail::class);
});

it('links a placed order to the authenticated customer', function () {
    [$user, $token] = loginAsCustomer();

    $response = postJson('/api/v1/orders', validCheckoutPayload(['customer_email' => $user->email]), [
        'Authorization' => "Bearer {$token}",
    ])->assertCreated();

    $order = Order::where('order_number', $response->json('data.orderNumber'))->first();
    expect($order->user_id)->toBe($user->id);

    getJson('/api/v1/account/orders', ['Authorization' => "Bearer {$token}"])
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('rejects checkout with missing required fields', function () {
    postJson('/api/v1/orders', validCheckoutPayload(['items' => []]))->assertUnprocessable();
});

it('exposes public settings and active slides without authentication', function () {
    getJson('/api/v1/settings')->assertOk()->assertJsonStructure(['data' => ['website', 'whatsapp', 'seo']]);
    getJson('/api/v1/slides?type=hero')->assertOk();
});
