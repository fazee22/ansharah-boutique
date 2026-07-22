<?php

use function Pest\Laravel\getJson;

it('reports a healthy status', function () {
    getJson('/api/v1/health')
        ->assertOk()
        ->assertJson([
            'success' => true,
        ])
        ->assertJsonStructure([
            'data' => ['status', 'database', 'timestamp'],
        ]);
});
