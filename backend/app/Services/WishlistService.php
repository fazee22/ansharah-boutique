<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Database\Eloquent\Collection;

/**
 * Backs the "Logged-in Wishlist" half of Phase 8's wishlist system —
 * the guest half stays entirely client-side (`store/wishlist-store.ts`,
 * localStorage, unchanged since Phase 4). `merge()` is called once,
 * right after login, to fold whatever the guest had locally into
 * their real account wishlist (see `useWishlistSync` on the
 * frontend) — a guest's saved items are never silently lost just
 * because they signed in.
 */
class WishlistService
{
    public function list(User $user): Collection
    {
        return Product::query()
            ->with(['category', 'images'])
            ->whereIn('id', $user->wishlistItems()->pluck('product_id'))
            ->get();
    }

    public function add(User $user, int $productId): void
    {
        WishlistItem::firstOrCreate(['user_id' => $user->id, 'product_id' => $productId]);
    }

    public function remove(User $user, int $productId): void
    {
        WishlistItem::where('user_id', $user->id)->where('product_id', $productId)->delete();
    }

    /**
     * @param  array<int, int>  $productIds  Product ids from the guest's local wishlist.
     */
    public function merge(User $user, array $productIds): void
    {
        $existingIds = $user->wishlistItems()->pluck('product_id')->all();

        foreach (array_diff($productIds, $existingIds) as $productId) {
            if (Product::whereKey($productId)->exists()) {
                WishlistItem::create(['user_id' => $user->id, 'product_id' => $productId]);
            }
        }
    }

    public function productIds(User $user): array
    {
        return $user->wishlistItems()->pluck('product_id')->all();
    }
}
