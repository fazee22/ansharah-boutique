"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import type { AdminCustomer } from "@/types/admin/customer";

export interface CustomerTableProps {
  customers: AdminCustomer[];
  isLoading: boolean;
}

function CustomerTable({ customers, isLoading }: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
              Loading customers…
            </TableCell>
          </TableRow>
        ) : customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
              No customers match your filters.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Link href={ROUTES.admin.customerDetail(customer.id)} className="flex flex-col">
                  <span className="text-body-sm text-ink hover:text-brass-dark">{customer.name}</span>
                  <span className="text-caption text-muted-foreground">{customer.email}</span>
                </Link>
              </TableCell>
              <TableCell className="text-caption text-muted-foreground">{customer.phone ?? "—"}</TableCell>
              <TableCell className="font-mono text-caption text-muted-foreground">{customer.ordersCount ?? 0}</TableCell>
              <TableCell>
                <Badge variant={customer.accountStatus === "active" ? "evergreen" : "destructive"}>
                  {customer.accountStatus === "active" ? "Active" : "Blocked"}
                </Badge>
              </TableCell>
              <TableCell className="text-caption text-muted-foreground">
                {formatDate(customer.createdAt, { month: "short", day: "numeric", year: "numeric" })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export { CustomerTable };
