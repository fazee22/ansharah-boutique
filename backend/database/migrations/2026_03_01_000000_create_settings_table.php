<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A single flexible key-value store backs Website Settings, WhatsApp
 * Settings, SEO Settings, the homepage section toggles, and the
 * marquee's behavior config (speed/direction/pause/swipe) — five
 * brief sections, one table. Each setting is namespaced by `group`
 * (e.g. "website", "whatsapp", "seo", "homepage", "marquee") so the
 * admin UI can fetch/save one group at a time without touching
 * unrelated settings, while the schema itself never needs a
 * migration to add a new individual setting field. This mirrors the
 * reasoning behind Phase 6's single `categories` tree: one flexible
 * structure beats five rigid, mostly-empty tables for data that's
 * fundamentally "a form the admin fills in."
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index();
            $table->string('key');
            $table->json('value')->nullable();
            $table->timestamps();

            $table->unique(['group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
