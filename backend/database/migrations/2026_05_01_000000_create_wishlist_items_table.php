<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Backs "Logged-in Wishlist" persistence (Phase 8). Guests keep using
 * the existing client-only `store/wishlist-store.ts` (localStorage,
 * Phase 4) — this table is only ever written to for an authenticated
 * user, and the guest wishlist is merged into it once, on login (see
 * `useWishlistSync` on the frontend).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};
