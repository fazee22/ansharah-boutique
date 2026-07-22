<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

/**
 * Powers both the New Arrivals Manager and the Sale Manager — same
 * "curated, ordered subset of the catalog" shape (`is_new_arrival` +
 * `new_arrival_position`, or `is_sale` + `sale_position`), so one
 * parameterized service serves both rather than two near-duplicates.
 */
class CurationService
{
    private const FLAG_COLUMN = [
        'new_arrivals' => 'is_new_arrival',
        'sale' => 'is_sale',
    ];

    private const POSITION_COLUMN = [
        'new_arrivals' => 'new_arrival_position',
        'sale' => 'sale_position',
    ];

    public function list(string $type): Collection
    {
        return Product::query()
            ->with(['category', 'images'])
            ->where(self::FLAG_COLUMN[$type], true)
            ->orderBy(self::POSITION_COLUMN[$type])
            ->get();
    }

    public function add(string $type, Product $product): Product
    {
        $flagColumn = self::FLAG_COLUMN[$type];
        $positionColumn = self::POSITION_COLUMN[$type];

        if (! $product->{$flagColumn}) {
            $nextPosition = (int) Product::where($flagColumn, true)->max($positionColumn) + 1;
            $product->update([$flagColumn => true, $positionColumn => $nextPosition]);
        }

        return $product->fresh(['category', 'images']);
    }

    public function remove(string $type, Product $product): Product
    {
        $product->update([self::FLAG_COLUMN[$type] => false, self::POSITION_COLUMN[$type] => null]);

        return $product->fresh();
    }

    /**
     * @param  array<int, array{id: int, position: int}>  $items
     */
    public function reorder(string $type, array $items): void
    {
        $positionColumn = self::POSITION_COLUMN[$type];
        $flagColumn = self::FLAG_COLUMN[$type];
        $curatedIds = Product::where($flagColumn, true)->pluck('id')->all();

        foreach ($items as $item) {
            if (! in_array($item['id'], $curatedIds, true)) {
                continue;
            }
            Product::whereKey($item['id'])->update([$positionColumn => $item['position']]);
        }
    }
}
