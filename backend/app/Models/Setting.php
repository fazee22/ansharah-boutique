<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['group', 'key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    /**
     * Every setting read goes through a short-lived cache — settings
     * change rarely but are read on nearly every admin page load (and
     * would be read on nearly every storefront page load too, once
     * Phase 6/7's scope decision to keep the storefront on mock data
     * is revisited). `forGroup()`/`set()` both bust the cache key they
     * touch, so a save is reflected immediately, never stale for up
     * to the cache TTL.
     */
    public static function forGroup(string $group): array
    {
        return Cache::remember("settings.{$group}", 300, function () use ($group) {
            return static::query()
                ->where('group', $group)
                ->get()
                ->mapWithKeys(fn (Setting $setting) => [$setting->key => $setting->value])
                ->all();
        });
    }

    public static function set(string $group, string $key, mixed $value): void
    {
        static::updateOrCreate(['group' => $group, 'key' => $key], ['value' => $value]);
        Cache::forget("settings.{$group}");
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public static function setMany(string $group, array $values): void
    {
        foreach ($values as $key => $value) {
            static::updateOrCreate(['group' => $group, 'key' => $key], ['value' => $value]);
        }
        Cache::forget("settings.{$group}");
    }
}
