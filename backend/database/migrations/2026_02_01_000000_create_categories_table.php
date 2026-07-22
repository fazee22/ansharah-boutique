<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A single self-referencing tree table backs BOTH "Category
 * Management" and "Collection Management" from the Phase 6 brief.
 * Structurally, "Summer Collection", "2 Piece", and "Embroidered
 * Lawn" are all just nodes at different depths of the same tree
 * (mirroring `frontend/src/constants/navigation.ts`'s `NavNode`
 * shape) — modeling them as two separate tables would mean
 * duplicating parent/child logic and, worse, would let a "category"
 * and a "collection" disagree about a product's placement. The admin
 * UI presents depth-0 nodes as "Collections" and everything else as
 * "Categories," but it is one tree underneath.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
