"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminThemeStore } from "@/store/admin-theme-store";

function ThemeToggle() {
  const theme = useAdminThemeStore((state) => state.theme);
  const toggle = useAdminThemeStore((state) => state.toggle);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}

export { ThemeToggle };
