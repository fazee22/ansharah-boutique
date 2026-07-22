import { CurationManager } from "@/components/admin/curation/curation-manager";
import { SaleSettingsForm } from "@/components/admin/content/sale-settings-form";

export default function AdminSalePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Sale</h1>
        <p className="text-body-sm text-muted-foreground">
          Curate which products are on sale, and manage the homepage sale banner.
        </p>
      </div>

      <SaleSettingsForm />

      <div>
        <h2 className="mb-4 font-display text-heading-sm text-foreground">Sale Products</h2>
        <CurationManager type="sale" emptyMessage="No products marked on sale yet — search and add some." />
      </div>
    </div>
  );
}
