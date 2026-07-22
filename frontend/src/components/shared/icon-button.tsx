"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const baseClass =
  "relative inline-flex h-11 w-11 items-center justify-center rounded-md text-ink " +
  "transition-colors duration-400 ease-luxury-ease hover:bg-ink/5 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-background";

interface IconIndicatorProps {
  indicator?: React.ReactNode;
}

function Indicator({ indicator }: IconIndicatorProps) {
  if (indicator === undefined || indicator === null) return null;
  return (
    <span
      className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-brass px-1 font-mono text-[0.625rem] font-semibold leading-none text-ink"
      aria-hidden="true"
    >
      {indicator}
    </span>
  );
}

type CommonProps = {
  label: string;
  icon: React.ReactNode;
  indicator?: React.ReactNode;
  className?: string;
};

export type IconButtonProps =
  | (CommonProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | (CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">);

/**
 * Consistent 44px-minimum-target icon control used throughout the
 * header (search, wishlist, cart, account). Renders a `<Link>` when
 * `href` is supplied and a `<button>` otherwise — never nest this
 * inside another interactive element; pass `href` instead of wrapping
 * it in a `<Link>` yourself.
 */
function IconButton({ label, icon, indicator, className, href, ...props }: IconButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className={cn(baseClass, className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon}
        <Indicator indicator={indicator} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(baseClass, className)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {icon}
      <Indicator indicator={indicator} />
    </button>
  );
}

export { IconButton };
