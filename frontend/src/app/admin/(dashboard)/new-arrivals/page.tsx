import { CurationManager } from "@/components/admin/curation/curation-manager";

export default function AdminNewArrivalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">New Arrivals</h1>
        <p className="text-body-sm text-muted-foreground">
          Curate which products appear in the homepage's New Arrivals section, and in what order.
        </p>
      </div>
      <CurationManager type="new_arrivals" emptyMessage="No products marked as new arrivals yet — search and add some." />
    </div>
  );
}
