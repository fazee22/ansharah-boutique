"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
  href: string;
  label: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Top-level nav item link. Underlines from the center on hover and
 * marks itself `aria-current="page"` when active — shared by
 * `DesktopNav` so active-state logic lives in exactly one place.
 */
function NavLink({ href, label, badge, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center gap-1.5 py-2 font-body text-body-sm tracking-wide text-ink",
        "transition-colors duration-400 ease-luxury-ease hover:text-brass-dark",
        className,
      )}
    >
      {label}
      {badge ? (
        <Badge variant={badge === "Sale" ? "destructive" : "brass"} className="px-1.5 py-0">
          {badge}
        </Badge>
      ) : null}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-brass-dark",
          "transition-all duration-400 ease-luxury-ease group-hover:w-full",
          isActive && "w-full",
        )}
      />
    </Link>
  );
}

export { NavLink };
