<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seeds the exact same collection/category tree
 * `frontend/src/constants/navigation.ts` hand-encodes for the
 * storefront's nav and mega menu. The two are NOT wired together
 * (the storefront still runs on the frontend's own mock catalog —
 * see PROJECT_MEMORY.md's Phase 6 notes), but keeping the tree
 * identical means a future phase that connects them is a data-
 * mapping exercise, not a redesign.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $summer = $this->make('Summer Collection');
        $this->makePieceGroup($summer, ['Embroidered Lawn', 'Printed Lawn']);

        $winter = $this->make('Winter Collection');
        $this->makePieceGroup($winter, ['Marina', 'Linen', 'Viscose', 'Winter Karandi', 'Khaddar']);

        $shawls = $this->make('Shawls');
        $this->make('Embroidered Shawls', $shawls);
        $this->make('Printed Shawls', $shawls);
    }

    private function makePieceGroup(Category $season, array $fabrics): void
    {
        foreach (['2 Piece', '3 Piece'] as $pieceType) {
            $piece = $this->make($pieceType, $season);
            foreach ($fabrics as $fabric) {
                $this->make($fabric, $piece);
            }
        }
    }

    private function make(string $name, ?Category $parent = null): Category
    {
        $slug = Str::slug($parent ? "{$parent->slug}-{$name}" : $name);

        return Category::create([
            'parent_id' => $parent?->id,
            'name' => $name,
            'slug' => $slug,
            'position' => 0,
            'is_visible' => true,
        ]);
    }
}
