<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NewsletterSubscriber>
 */
class NewsletterSubscriberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'source' => fake()->randomElement(['footer', 'homepage', 'checkout']),
            'subscribed_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
