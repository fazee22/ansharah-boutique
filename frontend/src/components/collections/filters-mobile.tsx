"use client";

import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FiltersPanel, type FiltersPanelProps } from "./filters-panel";

/**
 * Mobile equivalent of the desktop filter sidebar — same
 * `FiltersPanel`, presented in a `Sheet` (Phase 2's slide-in drawer)
 * instead of a persistent column, since there's no room for a
 * sidebar below the `lg` breakpoint.
 */
function FiltersMobile(props: FiltersPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="md" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {props.activeFilterCount > 0 ? ` (${props.activeFilterCount})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" title="Filters" description="Refine this collection" className="overflow-y-auto p-6">
        <div className="mt-8">
          <FiltersPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { FiltersMobile };
