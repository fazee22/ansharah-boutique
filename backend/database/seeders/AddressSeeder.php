<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        User::where('role', 'customer')->get()->each(function (User $customer) {
            $customer->addresses()->create([
                'type' => 'shipping',
                'label' => 'Home',
                'full_name' => $customer->name,
                'phone' => $customer->phone ?? '03001234567',
                'line1' => fake()->streetAddress(),
                'city' => fake()->randomElement(['Karachi', 'Lahore', 'Islamabad']),
                'postal_code' => fake()->postcode(),
                'country' => 'Pakistan',
                'is_default' => true,
            ]);
        });
    }
}
