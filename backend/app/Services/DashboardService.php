<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

/**
 * Powers the admin dashboard home. As of Phase 7, every figure here
 * is a real query — `totalOrders`/`totalCustomers`/`revenue` were
 * `null` placeholders through Phase 6 (Orders/Customers didn't exist
 * yet); now that they do, this class was updated in the same phase
 * that introduced them rather than leaving stale placeholders behind.
 * "Best Selling" now genuinely ranks by units sold (`order_items`),
 * replacing Phase 6's honest-but-approximate "Featured Products"
 * stand-in.
 */
class DashboardService
{
    private const LOW_STOCK_THRESHOLD = 5;

    public function stats(): array
    {
        return [
            'totalProducts' => Product::count(),
            'publishedProducts' => Product::where('status', 'published')->count(),
            'draftProducts' => Product::where('status', 'draft')->count(),
            'totalCategories' => Category::count(),
            'lowStockCount' => Product::where('status', 'published')
                ->where('stock_quantity', '>', 0)
                ->where('stock_quantity', '<=', self::LOW_STOCK_THRESHOLD)
                ->count(),
            'outOfStockCount' => Product::where('status', 'published')->where('stock_quantity', 0)->count(),
            'totalOrders' => Order::count(),
            'totalCustomers' => User::customers()->count(),
            'revenue' => (float) Order::where('payment_status', 'paid')->sum('total'),
        ];
    }

    public function lowStockProducts(int $limit = 8)
    {
        return Product::query()
            ->with('images')
            ->where('status', 'published')
            ->where('stock_quantity', '>', 0)
            ->where('stock_quantity', '<=', self::LOW_STOCK_THRESHOLD)
            ->orderBy('stock_quantity')
            ->limit($limit)
            ->get();
    }

    /**
     * Ranks products by total units sold across all order items —
     * real sales data, now that `orders`/`order_items` exist.
     */
    public function bestSellingProducts(int $limit = 6)
    {
        $productIds = OrderItem::query()
            ->selectRaw('product_id, SUM(quantity) as units_sold')
            ->whereNotNull('product_id')
            ->groupBy('product_id')
            ->orderByDesc('units_sold')
            ->limit($limit)
            ->pluck('product_id');

        if ($productIds->isEmpty()) {
            return collect();
        }

        $products = Product::with('images')->whereIn('id', $productIds)->get()->keyBy('id');

        // Re-apply the ranked order — whereIn() doesn't preserve it.
        return $productIds->map(fn ($id) => $products->get($id))->filter()->values();
    }

    public function recentActivity(int $limit = 8)
    {
        return Product::query()
            ->with(['category', 'images'])
            ->latest('updated_at')
            ->limit($limit)
            ->get();
    }

    public function latestOrders(int $limit = 8)
    {
        return Order::query()->latest()->limit($limit)->get();
    }
}
