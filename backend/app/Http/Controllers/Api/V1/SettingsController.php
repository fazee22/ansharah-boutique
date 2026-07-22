<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public, read-only counterpart to `Admin\SettingsController` (Phase
 * 7) — same `Setting::forGroup()` cache-backed read, no auth
 * required. This is what finally lets the storefront consume the
 * admin's real Website/WhatsApp/SEO/Homepage/Marquee/Sale settings
 * instead of the static `config/site.ts` values, closing the
 * "Settings are real but not read by the storefront" gap noted
 * throughout Phases 6–9.
 */
class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $groups = ['website', 'whatsapp', 'seo', 'homepage', 'marquee', 'sale', 'about'];

        $settings = collect($groups)->mapWithKeys(fn (string $group) => [$group => Setting::forGroup($group)]);

        return ApiResponse::success($settings);
    }
}
