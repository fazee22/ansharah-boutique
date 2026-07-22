<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

pest()->extend(TestCase::class)->in('Unit');

/**
 * Shared across every Feature test that needs an authenticated admin
 * — defined once here (Pest's global bootstrap) rather than per test
 * file, since PHP fatals on a redeclared top-level function.
 *
 * @return array{0: User, 1: string} [admin user, JWT access token]
 */
function loginAsAdmin(): array
{
    $admin = User::factory()->admin()->create();
    $token = auth('api')->login($admin);

    return [$admin, $token];
}

/**
 * @return array{0: User, 1: string} [customer user, JWT access token]
 */
function loginAsCustomer(): array
{
    $customer = User::factory()->create();
    $token = auth('api')->login($customer);

    return [$customer, $token];
}
