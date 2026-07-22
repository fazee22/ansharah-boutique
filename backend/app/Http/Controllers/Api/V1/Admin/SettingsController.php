<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Returns every settings group in one payload — the admin
     * Settings area has several tabs (Website, WhatsApp, SEO,
     * Homepage, Marquee, Sale) that all want to load together rather
     * than firing six separate requests on mount.
     */
    public function index(): JsonResponse
    {
        $groups = ['website', 'whatsapp', 'seo', 'homepage', 'marquee', 'sale', 'about'];

        $settings = collect($groups)->mapWithKeys(fn (string $group) => [$group => Setting::forGroup($group)]);

        return ApiResponse::success($settings);
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        Setting::setMany($request->validated('group'), $request->validated('values'));

        return ApiResponse::success(Setting::forGroup($request->validated('group')), 'Settings saved.');
    }
}
