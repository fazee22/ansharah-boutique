<?php

namespace Database\Factories;

use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 4500, 25000);
        $shipping = fake()->randomElement([0, 250, 350]);

        return [
            'order_number' => OrderService::generateOrderNumber(),
            'user_id' => User::factory(),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->numerify('03#########'),
            'status' => fake()->randomElement(\App\Models\Order::STATUSES),
            'subtotal' => $subtotal,
            'shipping_fee' => $shipping,
            'discount' => 0,
            'total' => $subtotal + $shipping,
            'currency' => 'PKR',
            'payment_method' => fake()->randomElement(['cod', 'card', 'bank_transfer']),
            'payment_status' => fake()->randomElement(['unpaid', 'paid']),
            'shipping_address' => [
                'fullName' => fake()->name(),
                'phone' => fake()->numerify('03#########'),
                'line1' => fake()->streetAddress(),
                'line2' => null,
                'city' => fake()->randomElement(['Karachi', 'Lahore', 'Islamabad']),
                'state' => null,
                'postalCode' => fake()->postcode(),
                'country' => 'Pakistan',
            ],
            'billing_address' => null,
        ];
    }
}
