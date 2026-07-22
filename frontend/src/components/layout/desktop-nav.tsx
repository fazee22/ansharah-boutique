"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { primaryNav } from "@/constants/navigation";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { NavLink } from "./nav-link";
import { MegaMenu } from "./mega-menu";
import { cn } from "@/lib/utils";

/**
 * Desktop primary navigation. Only one item (`Collections`, flagged
 * `megaMenu: true` in `constants/navigation.ts`) opens a panel — the
 * rest are plain `NavLink`s — but the open/close/outside-click/escape
 * wiring here is generic, so flagging a second top-nav item as a mega
 * menu in the data is enough to give it the same behavior.
 */
function DesktopNav() {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setOpenId(null);

  useClickOutside(navRef, close, openId !== null);
  useEscapeKey(close, openId !== null);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="relative hidden items-center gap-8 lg:flex"
      onMouseLeave={close}
      onBlur={(event) => {
        if (!navRef.current?.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      {primaryNav.map((item) => {
        if (!item.megaMenu) {
          return <NavLink key={item.id} href={item.href ?? "#"} label={item.label} badge={item.badge} />;
        }

        const panelId = `mega-menu-${item.id}`;
        const isOpen = openId === item.id;

        return (
          <div key={item.id} onMouseEnter={() => setOpenId(item.id)}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              onFocus={() => setOpenId(item.id)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 py-2 font-body text-body-sm tracking-wide text-ink",
                "transition-colors duration-400 ease-luxury-ease hover:text-brass-dark",
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-brass-dark",
                  "transition-all duration-400 ease-luxury-ease group-hover:w-full",
                  isOpen && "w-full",
                )}
              />
            </button>

            <AnimatePresence>{isOpen ? <MegaMenu id={panelId} node={item} /> : null}</AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

export { DesktopNav };
