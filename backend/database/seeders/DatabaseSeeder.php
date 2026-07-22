<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Phase 1 seeds a development admin account so the API can be
     * exercised end-to-end (login at admin@luxury.test / password —
     * see backend/README.md). Phase 6 adds the category tree and a
     * starter catalog. Phase 7 adds default settings, hero/marquee
     * slides, customer addresses, sample orders (there's no public
     * checkout yet — see PROJECT_MEMORY.md — so these are the only
     * orders that will exist until one is built), and newsletter
     * subscribers, so every new admin module has real data to manage
     * on first boot rather than an empty state.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@luxury.test',
        ]);

        if (app()->environment('local')) {
            User::factory()->count(10)->create();
        }

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            SettingsSeeder::class,
            SlideSeeder::class,
            AddressSeeder::class,
            OrderSeeder::class,
            NewsletterSubscriberSeeder::class,
        ]);
    }
}
