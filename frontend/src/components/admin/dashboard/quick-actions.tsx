import Link from "next/link";
import { PlusCircle, FolderPlus, Package } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const ACTIONS = [
  { label: "Add Product", href: ROUTES.admin.productNew, icon: PlusCircle },
  { label: "Add Category", href: `${ROUTES.admin.categories}?new=1`, icon: FolderPlus },
  { label: "View All Products", href: ROUTES.admin.products, icon: Package },
];

function QuickActions() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
      <h3 className="font-display text-heading-sm text-foreground">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-md border border-hairline px-4 py-3 text-body-sm text-ink transition-colors hover:border-brass hover:bg-brass/5"
            >
              <Icon className="h-4 w-4 text-brass-dark" aria-hidden="true" />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export { QuickActions };
