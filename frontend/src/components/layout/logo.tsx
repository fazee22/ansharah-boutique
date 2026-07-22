import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  inverted?: boolean;
}

function Logo({ className, inverted = false }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${siteConfig.name} — Home`}
      className={cn(
        "inline-flex flex-col leading-none transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span
        className={cn(
          "font-display text-[1.875rem] tracking-tight sm:text-display-md",
          inverted ? "text-porcelain" : "text-ink",
        )}
      >
        {siteConfig.name}
      </span>
      <span
        className={cn(
          "mt-1 font-mono text-[0.6875rem] uppercase tracking-widest",
          inverted ? "text-porcelain/60" : "text-muted-foreground",
        )}
      >
        {siteConfig.tagline}
      </span>
    </Link>
  );
}

export { Logo };