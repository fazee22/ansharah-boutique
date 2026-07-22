"use client";

import { useState } from "react";
import { Pagination } from "@/components/collections/pagination";
import { OrderFiltersBar } from "@/components/admin/orders/order-filters";
import { OrderTable } from "@/components/admin/orders/order-table";
import { useOrderList } from "@/hooks/admin/use-admin-orders";
import type { OrderListFilters } from "@/types/admin/order";

const PER_PAGE = 20;

export default function AdminOrdersPage() {
  const [filters, setFilters] = useState<OrderListFilters>({ sort: "newest", page: 1 });
  const { data, isLoading } = useOrderList({ ...filters, perPage: PER_PAGE });

  function updateFilters(patch: Partial<OrderListFilters>) {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Orders</h1>
        <p className="text-body-sm text-muted-foreground">
          {data?.meta.total ?? "…"} order{data?.meta.total === 1 ? "" : "s"} placed so far.
        </p>
      </div>

      <OrderFiltersBar filters={filters} onChange={updateFilters} />

      <OrderTable orders={data?.items ?? []} isLoading={isLoading} />

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
