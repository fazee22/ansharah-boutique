<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Http\Resources\Admin\ProductResource;
use App\Services\DashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard) {}

    public function __invoke(): JsonResponse
    {
        return ApiResponse::success([
            'stats' => $this->dashboard->stats(),
            'lowStockProducts' => ProductResource::collection($this->dashboard->lowStockProducts()),
            'bestSellingProducts' => ProductResource::collection($this->dashboard->bestSellingProducts()),
            'recentActivity' => ProductResource::collection($this->dashboard->recentActivity()),
            'latestOrders' => OrderResource::collection($this->dashboard->latestOrders()),
        ], 'Dashboard data retrieved.');
    }
}
