import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

/**
 * Consistent section heading treatment (eyebrow label + display
 * heading + optional supporting copy) reused across every content
 * section of the site, rather than each page rolling its own heading
 * markup and spacing.
 */
function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <span className="font-mono text-overline uppercase text-brass-dark">{eyebrow}</span>
      ) : null}
      <Heading className="text-display-sm text-foreground sm:text-display-md">{title}</Heading>
      {description ? (
        <p
          className={cn(
            "text-body-md text-muted-foreground",
            align === "center" ? "max-w-prose" : "max-w-[60ch]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionTitle };
