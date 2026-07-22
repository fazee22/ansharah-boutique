import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class lists safely, resolving conflicting utility
 * classes (e.g. `px-2` vs `px-4`) in favor of the last one supplied.
 * This is the standard Shadcn UI utility and is used by every
 * component under `src/components/ui`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
