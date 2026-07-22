<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\Seeder;

/**
 * Seeds realistic orders so Order Management has real data to
 * demonstrate against — there's no public checkout yet (that's a
 * later phase), so these are the only orders that will exist until
 * one is built. Order items reference real seeded products where
 * possible (snapshotting their current name/SKU/price, exactly as
 * `OrderService`/the real checkout flow eventually will), and every
 * order gets a proper status-history entry so the Order Timeline UI
 * has something real to render, not an empty state.
 */
class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        if ($customers->isEmpty()) {
            return;
        }

        $products = Product::with('images')->inRandomOrder()->limit(40)->get();
        if ($products->isEmpty()) {
            return;
        }

        foreach (range(1, 24) as $index) {
            $customer = $customers->random();
            $lineItems = $products->random(random_int(1, 3));
            $subtotal = 0;

            $order = Order::create([
                'order_number' => OrderService::generateOrderNumber(),
                'user_id' => $customer->id,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_phone' => $customer->phone ?? '03001234567',
                'status' => Order::STATUSES[array_rand(Order::STATUSES)],
                'subtotal' => 0, // finalized below once items are attached
                'shipping_fee' => random_int(0, 1) ? 0 : 350,
                'discount' => 0,
                'total' => 0,
                'currency' => 'PKR',
                'payment_method' => ['cod', 'card', 'bank_transfer'][array_rand(['cod', 'card', 'bank_transfer'])],
                'payment_status' => random_int(0, 1) ? 'paid' : 'unpaid',
                'shipping_address' => [
                    'fullName' => $customer->name,
                    'phone' => $customer->phone ?? '03001234567',
                    'line1' => fake()->streetAddress(),
                    'line2' => null,
                    'city' => fake()->randomElement(['Karachi', 'Lahore', 'Islamabad', 'Faisalabad']),
                    'state' => null,
                    'postalCode' => fake()->postcode(),
                    'country' => 'Pakistan',
                ],
                'billing_address' => null,
            ]);

            foreach ($lineItems as $product) {
                $price = (float) ($product->sale_price ?? $product->price);
                $quantity = random_int(1, 2);
                $lineTotal = $price * $quantity;
                $subtotal += $lineTotal;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'product_image_url' => $product->images->first()?->url,
                    'unit_price' => $price,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ]);
            }

            $order->update([
                'subtotal' => $subtotal,
                'total' => $subtotal + $order->shipping_fee - $order->discount,
            ]);

            $order->statusHistory()->create([
                'status' => $order->status,
                'changed_by' => null,
                'note' => 'Order created.',
            ]);

            if (random_int(0, 3) === 0) {
                $order->notes()->create([
                    'author_id' => null,
                    'body' => 'Customer requested delivery confirmation call before dispatch.',
                ]);
            }
        }
    }
}
