"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Website", href: ROUTES.admin.settingsWebsite },
  { label: "WhatsApp", href: ROUTES.admin.settingsWhatsapp },
  { label: "SEO", href: ROUTES.admin.settingsSeo },
];

function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 border-b border-hairline">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative px-1 pb-3 font-mono text-caption uppercase tracking-widest transition-colors",
              isActive ? "text-ink" : "text-muted-foreground hover:text-ink",
            )}
          >
            {tab.label}
            {isActive ? <span className="absolute inset-x-0 -bottom-px h-px bg-brass" aria-hidden="true" /> : null}
          </Link>
        );
      })}
    </div>
  );
}

export { SettingsTabs };
