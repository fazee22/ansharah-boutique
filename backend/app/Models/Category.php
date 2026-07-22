<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

/**
 * A single node in the collection/category tree. Depth 0 = a
 * top-level collection ("Summer Collection"); deeper nodes are what
 * the admin UI calls "categories." See the migration for the full
 * rationale on why this is one table, not two.
 */
class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'description',
        'image_url',
        'position',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /** @return HasMany<Category, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('position');
    }

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function isLeaf(): bool
    {
        return $this->children()->doesntExist();
    }

    /**
     * Every ancestor from the immediate parent up to the root,
     * nearest-first. Used to build a product's full breadcrumb trail
     * without N+1 queries piling up for deeply nested categories —
     * this tree is at most 4 levels deep, so a simple loop beats
     * pulling in a recursive-CTE package for the extra depth.
     */
    public function ancestors(): array
    {
        $chain = [];
        $node = $this->parent()->first();

        while ($node !== null) {
            $chain[] = $node;
            $node = $node->parent()->first();
        }

        return $chain;
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    public function scopeRoots(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }
}
