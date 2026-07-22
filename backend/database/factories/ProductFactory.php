<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $price = fake()->numberBetween(4500, 12000);

        return [
            'category_id' => Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'sku' => 'VR-'.strtoupper(Str::random(6)),
            'price' => $price,
            'sale_price' => null,
            'description' => fake()->paragraph(),
            'short_description' => fake()->sentence(),
            'stock_quantity' => fake()->numberBetween(0, 50),
            'status' => 'published',
            'is_featured' => false,
            'is_new_arrival' => false,
            'is_sale' => false,
            'tags' => [],
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft']);
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_sale' => true,
            'sale_price' => round(($attributes['price'] ?? 8000) * 0.75, -2),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock_quantity' => 0]);
    }
}
