"use client";

import { Search } from "lucide-react";
import type { AccountStatus, CustomerListFilters } from "@/types/admin/customer";

export interface CustomerFiltersBarProps {
  filters: CustomerListFilters;
  onChange: (patch: Partial<CustomerListFilters>) => void;
}

function CustomerFiltersBar({ filters, onChange }: CustomerFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by name, email, or phone…"
          className="h-11 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <select
        value={filters.accountStatus ?? ""}
        onChange={(event) => onChange({ accountStatus: (event.target.value || undefined) as AccountStatus | undefined })}
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <option value="">All Accounts</option>
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>
    </div>
  );
}

export { CustomerFiltersBar };
