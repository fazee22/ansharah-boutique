"use client";

import { ArrowUpDown } from "lucide-react";
import type { SortOption } from "@/types/product";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
];

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * A native `<select>` styled to match the design system rather than
 * a hand-built listbox — native selects are fully keyboard/screen-
 * reader accessible for free and behave correctly on mobile (the OS
 * picker), which a custom implementation would have to earn.
 */
function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="sort-by" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="h-11 appearance-none rounded-md border border-hairline bg-canvas py-2 pl-4 pr-9 text-body-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>
      <ArrowUpDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

export { SortDropdown };
