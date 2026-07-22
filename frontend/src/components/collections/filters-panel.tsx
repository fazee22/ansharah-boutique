"use client";

import { useState, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  COLLECTION_FILTER_OPTIONS,
  PIECE_TYPE_FILTER_OPTIONS,
  FABRIC_FILTER_OPTIONS,
} from "@/constants/filters";
import type { ProductFilters } from "@/lib/products";
import { cn } from "@/lib/utils";

export interface FilterVisibility {
  collection: boolean;
  pieceType: boolean;
  fabric: boolean;
}

export interface FiltersPanelProps {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
  visibility: FilterVisibility;
  activeFilterCount: number;
}

function toggleInArray(current: string[] | undefined, value: string): string[] {
  const list = current ?? [];
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function CheckboxRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-body-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="h-4 w-4 rounded-sm border-hairline text-brass-dark accent-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      />
      {label}
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-mono text-overline uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="mt-2 flex flex-col">{children}</div>
    </div>
  );
}

function QuickFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-pill border px-3 py-1.5 font-mono text-caption uppercase tracking-wide transition-colors",
        active
          ? "border-brass bg-brass/15 text-brass-dark"
          : "border-hairline text-muted-foreground hover:border-ink/30 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

/**
 * Filter controls shared by the desktop sidebar and the mobile
 * bottom-sheet (`CollectionFiltersMobile` wraps this same component
 * in a `Sheet`). `visibility` hides filter groups the current
 * route already fully constrains — e.g. on a leaf "Khaddar" page,
 * showing a "Fabric" checkbox list would be redundant since the
 * route itself already picked the fabric.
 */
function FiltersPanel({ filters, onChange, onReset, visibility, activeFilterCount }: FiltersPanelProps) {
  const [priceInputs, setPriceInputs] = useState({
    min: filters.minPrice?.toString() ?? "",
    max: filters.maxPrice?.toString() ?? "",
  });

  function applyPriceRange() {
    onChange({
      minPrice: priceInputs.min ? Number(priceInputs.min) : undefined,
      maxPrice: priceInputs.max ? Number(priceInputs.max) : undefined,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-heading-sm text-foreground">Filters</h2>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-caption uppercase tracking-widest text-brass-dark hover:underline"
          >
            Clear ({activeFilterCount})
          </button>
        ) : null}
      </div>

      <FilterGroup title="Quick Filters">
        <div className="flex flex-wrap gap-2">
          <QuickFilterChip
            label="New"
            active={Boolean(filters.isNew)}
            onClick={() => onChange({ isNew: filters.isNew ? undefined : true })}
          />
          <QuickFilterChip
            label="Featured"
            active={Boolean(filters.isFeatured)}
            onClick={() => onChange({ isFeatured: filters.isFeatured ? undefined : true })}
          />
          <QuickFilterChip
            label="Sale"
            active={Boolean(filters.isSale)}
            onClick={() => onChange({ isSale: filters.isSale ? undefined : true })}
          />
        </div>
      </FilterGroup>

      <Separator />

      {visibility.collection && COLLECTION_FILTER_OPTIONS.length > 0 ? (
        <>
          <FilterGroup title="Collection">
            {COLLECTION_FILTER_OPTIONS.map((option) => (
              <CheckboxRow
                key={option.id}
                label={option.label}
                checked={Boolean(filters.collectionIds?.includes(option.id))}
                onCheckedChange={() =>
                  onChange({ collectionIds: toggleInArray(filters.collectionIds, option.id) })
                }
              />
            ))}
          </FilterGroup>
          <Separator />
        </>
      ) : null}

      {visibility.pieceType && PIECE_TYPE_FILTER_OPTIONS.length > 0 ? (
        <>
          <FilterGroup title="Piece Type">
            {PIECE_TYPE_FILTER_OPTIONS.map((label) => (
              <CheckboxRow
                key={label}
                label={label}
                checked={Boolean(filters.pieceTypeLabels?.includes(label))}
                onCheckedChange={() =>
                  onChange({ pieceTypeLabels: toggleInArray(filters.pieceTypeLabels, label) })
                }
              />
            ))}
          </FilterGroup>
          <Separator />
        </>
      ) : null}

      {visibility.fabric && FABRIC_FILTER_OPTIONS.length > 0 ? (
        <>
          <FilterGroup title="Fabric">
            {FABRIC_FILTER_OPTIONS.map((label) => (
              <CheckboxRow
                key={label}
                label={label}
                checked={Boolean(filters.fabricLabels?.includes(label))}
                onCheckedChange={() =>
                  onChange({ fabricLabels: toggleInArray(filters.fabricLabels, label) })
                }
              />
            ))}
          </FilterGroup>
          <Separator />
        </>
      ) : null}

      <FilterGroup title="Price Range (PKR)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={priceInputs.min}
            onChange={(event) => setPriceInputs((current) => ({ ...current, min: event.target.value }))}
            onBlur={applyPriceRange}
            className="h-10 w-full rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={priceInputs.max}
            onChange={(event) => setPriceInputs((current) => ({ ...current, max: event.target.value }))}
            onBlur={applyPriceRange}
            className="h-10 w-full rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title="Availability">
        <CheckboxRow
          label="In Stock Only"
          checked={Boolean(filters.inStockOnly)}
          onCheckedChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>

      {activeFilterCount > 0 ? (
        <Button variant="outline" size="md" onClick={onReset} className="w-full">
          Clear All Filters
        </Button>
      ) : null}
    </div>
  );
}

export { FiltersPanel };
