<?php

use App\Models\User;
use function Pest\Laravel\postJson;

it('registers a new user and returns a token', function () {
    $response = postJson('/api/v1/auth/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonStructure([
            'data' => ['user', 'accessToken', 'expiresAt'],
        ]);

    expect(User::where('email', 'jane@example.com')->exists())->toBeTrue();
});

it('rejects login with invalid credentials', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('Password123'),
    ]);

    postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'wrong-password',
    ])->assertUnauthorized();
});

it('logs in a user with valid credentials', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('Password123'),
    ]);

    postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'Password123',
    ])->assertOk()->assertJsonPath('success', true);
});
