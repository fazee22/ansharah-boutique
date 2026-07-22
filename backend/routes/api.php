<?php

use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\CurationController as AdminCurationController;
use App\Http\Controllers\Api\V1\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\NewsletterSubscriberController as AdminNewsletterSubscriberController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController as AdminProductImageController;
use App\Http\Controllers\Api\V1\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\V1\Admin\SlideController as AdminSlideController;
use App\Http\Controllers\Api\V1\Admin\ImageUploadController;
use App\Http\Controllers\Api\V1\Account\AddressController as AccountAddressController;
use App\Http\Controllers\Api\V1\Account\OrderController as AccountOrderController;
use App\Http\Controllers\Api\V1\Account\ProfileController as AccountProfileController;
use App\Http\Controllers\Api\V1\Account\WishlistController as AccountWishlistController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\OrderLookupController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\SlideController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — v1
|--------------------------------------------------------------------------
|
| All routes are versioned under /api/v1 (see RouteServiceProvider)
| so breaking changes in a future v2 never affect existing clients.
| Storefront-facing commerce routes (public products, cart, checkout,
| orders...) are still reserved for a future phase — the storefront
| runs on the frontend's own mock catalog for now (see
| PROJECT_MEMORY.md). The `admin/*` group is internal-only: it powers
| the admin dashboard, not the storefront.
|
*/

Route::prefix('v1')->group(function () {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->middleware('throttle:10,1')->name('api.v1.newsletter.subscribe');
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('api.v1.contact.store');
    Route::post('/orders/lookup', [OrderLookupController::class, 'show'])->middleware('throttle:20,1')->name('api.v1.orders.lookup');
    Route::get('/settings', [SettingsController::class, 'index'])->name('api.v1.settings.index');
    Route::get('/slides', [SlideController::class, 'index'])->name('api.v1.slides.index');
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.v1.categories.index');
    Route::get('/products', [ProductController::class, 'index'])->name('api.v1.products.index');
   Route::get('/products/{slug}', [ProductController::class, 'show'])->name('api.v1.products.show');
    Route::post('/orders', [CheckoutController::class, 'store'])->middleware('throttle:10,1')->name('api.v1.orders.store');

    // --- Payments (Phase 9) -----------------------------------------
    // `methods`/`initiate` work for guests and authenticated customers
    // alike (see PaymentController::initiate()'s ownership check).
    // Webhooks and the gateway redirect bridges are provider-facing,
    // never called by our own frontend directly.
    Route::prefix('payments')->name('api.v1.payments.')->group(function () {
        Route::get('/methods', [PaymentController::class, 'methods'])->name('methods');
        Route::post('/initiate', [PaymentController::class, 'initiate'])
            ->middleware('throttle:10,1')
            ->name('initiate');
        Route::post('/webhook/{gateway}', [PaymentController::class, 'webhook'])->name('webhook');
        Route::get('/jazzcash/redirect/{reference}', [PaymentController::class, 'jazzcashRedirect'])
            ->middleware('signed')
            ->name('jazzcash.redirect');
        Route::get('/easypaisa/redirect/{reference}', [PaymentController::class, 'easypaisaRedirect'])
            ->middleware('signed')
            ->name('easypaisa.redirect');
    });

    Route::prefix('auth')->name('api.v1.auth.')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1')->name('register');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login');

        Route::middleware('jwt.auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
            Route::get('/me', [AuthController::class, 'me'])->name('me');
        });
    });

    // --- Admin ---------------------------------------------------------
    // Every route below requires a valid JWT AND an admin/super_admin
    // role (`EnsureUserHasRole`, aliased `role` in bootstrap/app.php).
    Route::prefix('admin')
        ->name('api.v1.admin.')
        ->middleware(['jwt.auth', 'role:admin,super_admin'])
        ->group(function () {
            Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

            // Categories & Collections (Phase 6)
            Route::apiResource('categories', AdminCategoryController::class);
            Route::patch('/categories/{category}/toggle-visibility', [AdminCategoryController::class, 'toggleVisibility'])
                ->name('categories.toggle-visibility');
                Route::post('/categories/{category}/image', [AdminCategoryController::class, 'uploadImage'])
                ->name('categories.upload-image');
            Route::post('/categories/reorder', [AdminCategoryController::class, 'reorder'])->name('categories.reorder');

            // Products (Phase 6)
            Route::apiResource('products', AdminProductController::class);
            Route::post('/products/{product}/duplicate', [AdminProductController::class, 'duplicate'])->name('products.duplicate');
            Route::post('/products/bulk-action', [AdminProductController::class, 'bulkAction'])->name('products.bulk-action');
            Route::post('/products/{product}/images', [AdminProductImageController::class, 'store'])->name('products.images.store');
            Route::post('/products/{product}/images/reorder', [AdminProductImageController::class, 'reorder'])->name('products.images.reorder');
            Route::patch('/products/{product}/images/{image}/featured', [AdminProductImageController::class, 'setFeatured'])->name('products.images.featured');
            Route::delete('/products/{product}/images/{image}', [AdminProductImageController::class, 'destroy'])->name('products.images.destroy');

            // New Arrivals / Sale curation (Phase 7) — ?type=new_arrivals|sale
            Route::get('/curation', [AdminCurationController::class, 'index'])->name('curation.index');
            Route::post('/curation/{product}/add', [AdminCurationController::class, 'add'])->name('curation.add');
            Route::post('/curation/{product}/remove', [AdminCurationController::class, 'remove'])->name('curation.remove');
            Route::post('/curation/reorder', [AdminCurationController::class, 'reorder'])->name('curation.reorder');

            // Orders (Phase 7)
            Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
            Route::post('/orders/{order}/notes', [AdminOrderController::class, 'addNote'])->name('orders.notes.store');

            // Customers (Phase 7)
            Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
            Route::get('/customers/{customer}', [AdminCustomerController::class, 'show'])->name('customers.show');
            Route::patch('/customers/{customer}/status', [AdminCustomerController::class, 'updateStatus'])->name('customers.status');
            Route::post('/customers/{customer}/notes', [AdminCustomerController::class, 'addNote'])->name('customers.notes.store');

            // Slides — Hero Banner + Auto Moving Slider (Phase 7)
            Route::get('/slides', [AdminSlideController::class, 'index'])->name('slides.index');
            Route::post('/upload-image', [ImageUploadController::class, 'store'])->name('upload-image');
            Route::post('/slides', [AdminSlideController::class, 'store'])->name('slides.store');
            Route::put('/slides/{slide}', [AdminSlideController::class, 'update'])->name('slides.update');
            Route::delete('/slides/{slide}', [AdminSlideController::class, 'destroy'])->name('slides.destroy');
            Route::patch('/slides/{slide}/toggle-active', [AdminSlideController::class, 'toggleActive'])->name('slides.toggle-active');
            Route::post('/slides/reorder', [AdminSlideController::class, 'reorder'])->name('slides.reorder');

            // Settings — Website / WhatsApp / SEO / Homepage / Marquee / Sale (Phase 7)
            Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
            Route::put('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');

            // Newsletter subscribers (Phase 7)
            Route::get('/newsletter-subscribers', [AdminNewsletterSubscriberController::class, 'index'])->name('newsletter-subscribers.index');
            Route::get('/newsletter-subscribers/export', [AdminNewsletterSubscriberController::class, 'export'])->name('newsletter-subscribers.export');
            Route::delete('/newsletter-subscribers/{subscriber}', [AdminNewsletterSubscriberController::class, 'destroy'])->name('newsletter-subscribers.destroy');
        });

    // --- Account (Phase 8) ----------------------------------------
    // Any authenticated user (customer or admin) — no role restriction,
    // unlike `admin/*` above. Every controller scopes data to
    // `$request->user()` itself; there is no "list all customers'
    // addresses/orders" capability here — that's what the `admin/*`
    // group is for.
    Route::prefix('account')
        ->name('api.v1.account.')
        ->middleware('jwt.auth')
        ->group(function () {
            Route::get('/profile', [AccountProfileController::class, 'show'])->name('profile.show');
            Route::put('/profile', [AccountProfileController::class, 'update'])->name('profile.update');
            Route::put('/password', [AccountProfileController::class, 'changePassword'])->name('password.update');

            Route::get('/addresses', [AccountAddressController::class, 'index'])->name('addresses.index');
            Route::post('/addresses', [AccountAddressController::class, 'store'])->name('addresses.store');
            Route::put('/addresses/{address}', [AccountAddressController::class, 'update'])->name('addresses.update');
            Route::delete('/addresses/{address}', [AccountAddressController::class, 'destroy'])->name('addresses.destroy');
            Route::patch('/addresses/{address}/default', [AccountAddressController::class, 'setDefault'])->name('addresses.default');

            Route::get('/orders', [AccountOrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order}', [AccountOrderController::class, 'show'])->name('orders.show');

            Route::get('/wishlist', [AccountWishlistController::class, 'index'])->name('wishlist.index');
            Route::post('/wishlist/merge', [AccountWishlistController::class, 'merge'])->name('wishlist.merge');
            Route::post('/wishlist/{product}', [AccountWishlistController::class, 'store'])->name('wishlist.store');
            Route::delete('/wishlist/{product}', [AccountWishlistController::class, 'destroy'])->name('wishlist.destroy');
        });

    // --- Reserved for future phases --------------------------------
    // Route::apiResource('products', ProductController::class); // public storefront read endpoints
    // Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']); // public checkout
});
