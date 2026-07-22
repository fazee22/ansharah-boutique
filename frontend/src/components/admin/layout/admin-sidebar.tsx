"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Sparkles,
  Tag,
  Settings,
  Mail,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

interface NavSection {
  label: string | null;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [{ label: "Dashboard", href: ROUTES.admin.root, icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: ROUTES.admin.products, icon: Package },
      { label: "Categories & Collections", href: ROUTES.admin.categories, icon: FolderTree },
      { label: "New Arrivals", href: ROUTES.admin.newArrivals, icon: Sparkles },
      { label: "Sale", href: ROUTES.admin.sale, icon: Tag },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: ROUTES.admin.orders, icon: ShoppingCart },
      { label: "Customers", href: ROUTES.admin.customers, icon: Users },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Homepage", href: ROUTES.admin.contentHomepage, icon: LayoutDashboard },
      { label: "About Page", href: ROUTES.admin.contentAbout, icon: ImageIcon },
      { label: "Hero Banner", href: ROUTES.admin.contentHero, icon: ImageIcon },
      { label: "Auto Moving Slider", href: ROUTES.admin.contentSlider, icon: ImageIcon },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Settings", href: ROUTES.admin.settingsWebsite, icon: Settings },
      { label: "Newsletter", href: ROUTES.admin.newsletter, icon: Mail },
    ],
  },
];

export interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex h-full flex-col gap-6 overflow-y-auto bg-ink px-4 py-6 text-porcelain print:hidden",
        className,
      )}
      aria-label="Admin"
    >
      <div className="px-2">
        <Logo inverted />
      </div>

      <div className="flex flex-col gap-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label ?? "root"} className="flex flex-col gap-1">
            {section.label ? (
              <span className="px-3 font-mono text-[0.6875rem] uppercase tracking-widest text-porcelain/40">
                {section.label}
              </span>
            ) : null}
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm transition-colors duration-300 ease-luxury-ease",
                        isActive
                          ? "bg-porcelain/10 text-porcelain"
                          : "text-porcelain/70 hover:bg-porcelain/5 hover:text-porcelain",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export { AdminSidebar };
