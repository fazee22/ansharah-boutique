<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Slide>
 */
class SlideFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => 'hero',
            'title' => fake()->sentence(4),
            'subtitle' => fake()->sentence(8),
            'image_url' => fake()->imageUrl(1600, 900, 'fashion'),
            'image_public_id' => null,
            'link_url' => '/collections',
            'cta_label' => 'Shop Now',
            'position' => 0,
            'is_active' => true,
        ];
    }

    public function marquee(): static
    {
        return $this->state(fn () => ['type' => 'marquee']);
    }
}
