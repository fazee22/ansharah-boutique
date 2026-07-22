<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'shipping',
            'label' => 'Home',
            'full_name' => fake()->name(),
            'phone' => fake()->numerify('03#########'),
            'line1' => fake()->streetAddress(),
            'line2' => null,
            'city' => fake()->randomElement(['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan']),
            'state' => null,
            'postal_code' => fake()->postcode(),
            'country' => 'Pakistan',
            'is_default' => true,
        ];
    }
}
