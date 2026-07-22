"use client";

import { useState } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/collections/pagination";
import { useNewsletterSubscribers, useDeleteSubscriber, useExportSubscribers } from "@/hooks/admin/use-admin-newsletter";
import { formatDate } from "@/lib/format";

export default function AdminNewsletterPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNewsletterSubscribers({ search, page });
  const deleteSubscriber = useDeleteSubscriber();
  const exportSubscribers = useExportSubscribers();

  const subscribers = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">Newsletter</h1>
          <p className="text-body-sm text-muted-foreground">
            {data?.meta.total ?? "…"} subscriber{data?.meta.total === 1 ? "" : "s"} collected from the footer and
            homepage forms.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          isLoading={exportSubscribers.isPending}
          onClick={() => exportSubscribers.mutate()}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by email…"
          className="h-11 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Subscribed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                Loading subscribers…
              </TableCell>
            </TableRow>
          ) : subscribers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                No subscribers yet.
              </TableCell>
            </TableRow>
          ) : (
            subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="text-body-sm text-ink">{subscriber.email}</TableCell>
                <TableCell className="text-caption capitalize text-muted-foreground">
                  {subscriber.source ?? "—"}
                </TableCell>
                <TableCell className="text-caption text-muted-foreground">
                  {formatDate(subscriber.subscribedAt, { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    aria-label={`Remove ${subscriber.email}`}
                    onClick={() => deleteSubscriber.mutate(subscriber.id)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {data && data.meta.lastPage > 1 ? (
        <Pagination currentPage={data.meta.currentPage} totalPages={data.meta.lastPage} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
