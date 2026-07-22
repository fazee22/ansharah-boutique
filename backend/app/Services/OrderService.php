<?php

namespace App\Services;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Support\ActivityLogger;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Creates a real order from the storefront's cart/checkout data.
     * Line items are stored as snapshots (`product_name`/`sku`/
     * `image_url`/`price` on `order_items`, not a required
     * `product_id`) — the storefront's cart is still built from the
     * mock catalog (`lib/mock/products.ts`, the Phase 6 scope
     * decision), whose ids don't correspond to real backend product
     * rows, so `product_id` is left null rather than fabricated. This
     * is exactly what `order_items.product_id` being nullable
     * (Phase 7) was designed for — placing real, fully-functional
     * orders never actually required solving that deeper mock-vs-real
     * catalog gap.
     *
     * @param  array<int, array{name: string, sku: string, imageUrl: ?string, unitPrice: float, quantity: int}>  $items
     */
    public function createFromCheckout(array $attributes, array $items, ?int $userId): Order
    {
        return DB::transaction(function () use ($attributes, $items, $userId) {
            $subtotal = collect($items)->sum(fn (array $item) => $item['unitPrice'] * $item['quantity']);
            $shippingFee = (float) ($attributes['shippingFee'] ?? 0);
            $total = $subtotal + $shippingFee;

            $order = Order::create([
                'order_number' => self::generateOrderNumber(),
                'user_id' => $userId,
                'customer_name' => $attributes['customerName'],
                'customer_email' => $attributes['customerEmail'],
                'customer_phone' => $attributes['customerPhone'],
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount' => 0,
                'total' => $total,
                'currency' => $attributes['currency'] ?? 'PKR',
                'payment_method' => $attributes['paymentMethod'],
                'payment_status' => 'unpaid',
                'shipping_address' => $attributes['shippingAddress'],
                'billing_address' => $attributes['billingAddress'] ?? null,
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => null,
                    'product_name' => $item['name'],
                    'product_sku' => $item['sku'],
                    'product_image_url' => $item['imageUrl'] ?? null,
                    'unit_price' => $item['unitPrice'],
                    'quantity' => $item['quantity'],
                    'line_total' => $item['unitPrice'] * $item['quantity'],
                ]);
            }

            $order->statusHistory()->create([
                'status' => 'pending',
                'changed_by' => null,
                'note' => 'Order placed.',
            ]);

            ActivityLogger::log('order.placed', "Order #{$order->id}", ['order_number' => $order->order_number]);

            Mail::to($order->customer_email)->queue(new OrderConfirmationMail($order->load('items')));

            return $order->fresh(['items', 'statusHistory']);
        });
    }

    /**
     * Every status change is written to `order_status_histories` in
     * the same transaction as the status update itself — the Order
     * Timeline UI reads that table, never derives a history from
     * `updated_at` timestamps, so it stays accurate even if an order
     * is updated for unrelated reasons (e.g. a note added) between
     * status changes.
     */
    public function updateStatus(Order $order, string $status, ?int $changedBy, ?string $note = null): Order
    {
        if (! in_array($status, Order::STATUSES, true)) {
            throw ValidationException::withMessages(['status' => 'Invalid order status.']);
        }

        return DB::transaction(function () use ($order, $status, $changedBy, $note) {
            $order->update(['status' => $status]);

            $order->statusHistory()->create([
                'status' => $status,
                'changed_by' => $changedBy,
                'note' => $note,
            ]);

            ActivityLogger::log('order.status_changed', "Order #{$order->id}", ['order_number' => $order->order_number, 'status' => $status]);

            return $order->fresh(['items', 'statusHistory', 'notes']);
        });
    }

    public function addNote(Order $order, ?int $authorId, string $body): Order
    {
        $order->notes()->create(['author_id' => $authorId, 'body' => $body]);

        return $order->fresh(['notes']);
    }

    public static function generateOrderNumber(): string
    {
        do {
            $candidate = 'VR-'.now()->format('ymd').'-'.strtoupper(Str::random(4));
        } while (Order::where('order_number', $candidate)->exists());

        return $candidate;
    }
}
