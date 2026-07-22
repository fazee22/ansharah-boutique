"use client";

import { useState } from "react";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { AnnouncementBar } from "./announcement-bar";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { SearchOverlay } from "./search-overlay";
import { IconButton } from "@/components/shared/icon-button";
import { Container } from "@/components/shared/container";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Global site header: announcement bar + logo + desktop mega-menu nav
 * + utility icons, sticky with a subtle compaction/elevation change
 * once the page scrolls. Mounted once in `app/layout.tsx` so it (and
 * its scroll/menu state) persists across route changes.
 */
function Header() {
  const isScrolled = useScrollPosition(24);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hasMounted = useHasMounted();
  const cartCount = useCartStore((state) => state.itemCount());
  const wishlistCount = useWishlistStore((state) => state.productIds.length);

  return (
    <header className="sticky top-0 z-50 print:hidden">
      <AnnouncementBar />

      <div
        className={cn(
          "relative border-b border-hairline bg-canvas/95 backdrop-blur-md transition-shadow duration-400 ease-luxury-ease",
          isScrolled && "shadow-soft",
        )}
      >
        <Container>
          <div
            className={cn(
              "flex items-center justify-between transition-[height] duration-400 ease-luxury-ease",
              isScrolled ? "h-16" : "h-20",
            )}
          >
            <div className="flex items-center gap-4">
              <MobileNav />
              <Logo />
            </div>

            <DesktopNav />

            <div className="flex items-center gap-1">
              <IconButton
                label="Search"
                icon={<Search className="h-5 w-5" aria-hidden="true" />}
                aria-expanded={isSearchOpen}
                onClick={() => setIsSearchOpen((value) => !value)}
              />
              <IconButton
                href={ROUTES.wishlist}
                label="Wishlist"
                icon={<Heart className="h-5 w-5" aria-hidden="true" />}
                indicator={hasMounted && wishlistCount > 0 ? wishlistCount : undefined}
                className="hidden sm:inline-flex"
              />
              <IconButton
                href={ROUTES.cart}
                label="Cart"
                icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
                indicator={hasMounted && cartCount > 0 ? cartCount : undefined}
              />
              <IconButton
                href={ROUTES.account}
                label="Account"
                icon={<User className="h-5 w-5" aria-hidden="true" />}
                className="hidden sm:inline-flex"
              />
            </div>
          </div>
        </Container>

        <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </header>
  );
}

export { Header };
