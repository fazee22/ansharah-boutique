"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, Heart, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./logo";
import { primaryNav } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useWishlistStore } from "@/store/wishlist-store";
import type { NavNode } from "@/types/navigation";

function MobileNavNode({ node, onNavigate }: { node: NavNode; onNavigate: () => void }) {
  const hasChildren = !!node.children?.length;

  if (!hasChildren) {
    return (
      <Link
        href={node.href ?? "#"}
        onClick={onNavigate}
        className="flex items-center justify-between py-3 text-body-sm text-ink transition-colors hover:text-brass-dark"
      >
        {node.label}
      </Link>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value={node.id} className="border-b-0">
        <AccordionTrigger className="py-3 text-body-sm font-medium">
          {node.label}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-1 border-l border-hairline pl-4">
            {node.children!.map((child) => (
              <MobileNavNode key={child.id} node={child} onNavigate={onNavigate} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * Luxury slide-in mobile menu. The nav tree is the same
 * `primaryNav` data the desktop mega menu consumes — nested items
 * become accordion sections instead of hover columns, which is the
 * touch-appropriate equivalent of the same information architecture.
 */
function MobileNav() {
  const [open, setOpen] = useState(false);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-ink/5 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        title="Site navigation"
        description="Browse collections and site links"
        className="flex w-full max-w-sm flex-col p-0"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <Logo />
        </div>

        <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col divide-y divide-hairline">
            {primaryNav.map((item) => (
              <MobileNavNode key={item.id} node={item} onNavigate={close} />
            ))}
          </div>
        </nav>

        <Separator />

        <div className="flex items-center justify-around px-6 py-5">
          <Link
            href={ROUTES.account}
            onClick={close}
            className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground"
          >
            <User className="h-5 w-5 text-ink" aria-hidden="true" />
            Account
          </Link>
          <Link
            href={ROUTES.wishlist}
            onClick={close}
            className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground"
          >
            <span className="relative">
              <Heart className="h-5 w-5 text-ink" aria-hidden="true" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 font-mono text-[0.625rem] text-ink">
                  {wishlistCount}
                </span>
              ) : null}
            </span>
            Wishlist
          </Link>
          <Link
            href="#"
            onClick={close}
            className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground"
          >
            <Search className="h-5 w-5 text-ink" aria-hidden="true" />
            Search
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
