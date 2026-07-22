<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // The LEAF category a product belongs to (e.g. "Khaddar"),
            // never an intermediate node — the storefront derives the
            // full "Winter Collection / 2 Piece / Khaddar" trail by
            // walking `categories.parent_id` up from here.
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->longText('description')->nullable();
            $table->text('short_description')->nullable();
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->enum('status', ['draft', 'published', 'hidden'])->default('draft')->index();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->boolean('is_sale')->default(false);
            $table->json('tags')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();

            $table->index(['status', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
