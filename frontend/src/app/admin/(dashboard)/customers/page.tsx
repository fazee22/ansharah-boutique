"use client";

import { useState } from "react";
import { Pagination } from "@/components/collections/pagination";
import { CustomerFiltersBar } from "@/components/admin/customers/customer-filters";
import { CustomerTable } from "@/components/admin/customers/customer-table";
import { useCustomerList } from "@/hooks/admin/use-admin-customers";
import type { CustomerListFilters } from "@/types/admin/customer";

const PER_PAGE = 20;

export default function AdminCustomersPage() {
  const [filters, setFilters] = useState<CustomerListFilters>({ page: 1 });
  const { data, isLoading } = useCustomerList({ ...filters, perPage: PER_PAGE });

  function updateFilters(patch: Partial<CustomerListFilters>) {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Customers</h1>
        <p className="text-body-sm text-muted-foreground">
          {data?.meta.total ?? "…"} customer{data?.meta.total === 1 ? "" : "s"} registered.
        </p>
      </div>

      <CustomerFiltersBar filters={filters} onChange={updateFilters} />

      <CustomerTable customers={data?.items ?? []} isLoading={isLoading} />

      {data && data.meta.lastPage > 1 ? (
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.lastPage}
          onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        />
      ) : null}
    </div>
  );
}
