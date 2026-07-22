<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Backs the New Arrivals Manager and Sale Manager's "Reorder"
 * requirement. `is_new_arrival`/`is_sale` (Phase 6) already control
 * membership; these two nullable positions control display order
 * *within* each curated list independently of each other and of the
 * product's general catalog order — a product can rank #1 in New
 * Arrivals and #5 in Sale simultaneously.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('new_arrival_position')->nullable()->after('is_new_arrival');
            $table->unsignedInteger('sale_position')->nullable()->after('is_sale');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['new_arrival_position', 'sale_position']);
        });
    }
};
