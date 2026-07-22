<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This API-first application serves no server-rendered views. The
| single web route below exists only so visiting the API's root in a
| browser returns a clear, human-readable message instead of a 404.
| All real traffic goes through routes/api.php.
|
*/

Route::get('/', function () {
    return response()->json([
        'service' => 'Luxury Fashion E-Commerce API',
        'status' => 'ok',
        'docs' => '/api/v1/health',
    ]);
});
