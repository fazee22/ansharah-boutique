<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    public function create(array $data): Category
    {
        $data['slug'] = $this->resolveSlug($data['name'], $data['slug'] ?? null);

        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        if (array_key_exists('name', $data) && empty($data['slug'])) {
            $data['slug'] = $this->resolveSlug($data['name'], null, $category->id);
        }

        if (array_key_exists('parent_id', $data) && $data['parent_id']) {
            $this->assertNotSelfOrDescendant($category, (int) $data['parent_id']);
        }

        $category->update($data);

        return $category->fresh();
    }

    /**
     * Refuses to delete a category that still has children or
     * products — an admin has to explicitly move or remove those
     * first. Silently cascading would either orphan products (if we
     * nulled category_id, but the column is NOT NULL by design) or
     * delete them, both of which are far too destructive for a
     * single "delete category" click.
     */
    public function delete(Category $category): void
    {
        if ($category->children()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'This category has subcategories. Move or delete them first.',
            ]);
        }

        if ($category->products()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'This category still has products assigned. Reassign them first.',
            ]);
        }

        $category->delete();
    }

    /**
     * @param  array<int, array{id: int, position: int}>  $items
     */
    public function reorder(array $items): void
    {
        foreach ($items as $item) {
            Category::whereKey($item['id'])->update(['position' => $item['position']]);
        }
    }

    /** Builds the full tree, roots first, each with `children` eager-loaded recursively. */
    public function tree(): \Illuminate\Database\Eloquent\Collection
    {
        return Category::query()
            ->roots()
            ->orderBy('position')
            ->with('children.children.children') // the tree is at most 4 levels deep — see the migration's rationale comment
            ->withCount('products')
            ->get();
    }

    private function resolveSlug(string $name, ?string $requestedSlug, ?int $ignoreId = null): string
    {
        $base = Str::slug($requestedSlug ?: $name);
        $slug = $base;
        $suffix = 1;

        while (
            Category::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->exists()
        ) {
            $suffix++;
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
    }

    private function assertNotSelfOrDescendant(Category $category, int $candidateParentId): void
    {
        if ($candidateParentId === $category->id) {
            throw ValidationException::withMessages(['parent_id' => 'A category cannot be its own parent.']);
        }

        $node = Category::find($candidateParentId);

        while ($node !== null) {
            if ($node->id === $category->id) {
                throw ValidationException::withMessages([
                    'parent_id' => 'A category cannot be moved under one of its own subcategories.',
                ]);
            }
            $node = $node->parent()->first();
        }
    }
}
