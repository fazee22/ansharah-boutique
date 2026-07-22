<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Backs BOTH the homepage Hero Banner and the "Auto Moving Slider"
 * (the collection marquee from Phase 3) — `type` distinguishes them.
 * Both are, structurally, "an ordered, enable/disable-able list of
 * images with an optional label and link" — the same shape the
 * Phase 6 `categories` tree and `settings` table both lean on: one
 * table for a family of admin-editable ordered lists, not one table
 * per slider.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['hero', 'marquee'])->index();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('image_url');
            $table->string('image_public_id')->nullable();
            $table->string('link_url')->nullable();
            $table->string('cta_label')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slides');
    }
};
