"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, ShoppingBag, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotesPanel } from "@/components/admin/shared/notes-panel";
import { useCustomer, useAddCustomerNote, useUpdateCustomerStatus } from "@/hooks/admin/use-admin-customers";
import { formatCurrency, formatDate } from "@/lib/format";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const customerId = Number(id);
  const { data, isLoading, isError } = useCustomer(Number.isFinite(customerId) ? customerId : null);
  const addNote = useAddCustomerNote(customerId);
  const updateStatus = useUpdateCustomerStatus(customerId);

  if (!Number.isFinite(customerId)) notFound();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64 rounded" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !data) notFound();

  const { customer, stats } = data;
  const isActive = customer.accountStatus === "active";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-display-sm font-light text-foreground">{customer.name}</h1>
            <Badge variant={isActive ? "evergreen" : "destructive"}>{isActive ? "Active" : "Blocked"}</Badge>
          </div>
          <p className="text-body-sm text-muted-foreground">
            Joined {formatDate(customer.createdAt, { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          isLoading={updateStatus.isPending}
          onClick={() => updateStatus.mutate(isActive ? "blocked" : "active")}
          className={isActive ? "border-destructive/30 text-destructive hover:bg-destructive/10" : undefined}
        >
          {isActive ? "Block Account" : "Reactivate Account"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-5">
          <ShoppingBag className="h-5 w-5 text-brass-dark" aria-hidden="true" />
          <div>
            <p className="font-display text-heading-md text-foreground">{stats.totalOrders}</p>
            <p className="text-caption text-muted-foreground">Total Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-5">
          <DollarSign className="h-5 w-5 text-brass-dark" aria-hidden="true" />
          <div>
            <p className="font-display text-heading-md text-foreground">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-caption text-muted-foreground">Lifetime Spend (Paid)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-5">
          <ShoppingBag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-display text-heading-md text-foreground">
              {stats.lastOrderAt ? formatDate(stats.lastOrderAt, { month: "short", day: "numeric", year: "numeric" }) : "—"}
            </p>
            <p className="text-caption text-muted-foreground">Last Order</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-hairline bg-card p-6">
          <h2 className="mb-3 font-display text-heading-sm text-foreground">Contact Information</h2>
          <div className="flex flex-col gap-2 text-body-sm text-ink">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {customer.email}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {customer.phone ?? "Not provided"}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-hairline bg-card p-6">
          <h2 className="mb-3 font-display text-heading-sm text-foreground">Saved Addresses</h2>
          {customer.addresses.length === 0 ? (
            <p className="text-caption text-muted-foreground">No saved addresses.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {customer.addresses.map((address) => (
                <li key={address.id} className="flex items-start gap-2 text-body-sm text-ink">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {address.label ? <span className="font-medium">{address.label}: </span> : null}
                    {address.line1}, {address.city}
                    {address.postalCode ? `, ${address.postalCode}` : ""}, {address.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <NotesPanel
        title="Customer Notes"
        notes={customer.notes}
        onAddNote={(body) => addNote.mutate(body)}
        isPending={addNote.isPending}
      />
    </div>
  );
}
