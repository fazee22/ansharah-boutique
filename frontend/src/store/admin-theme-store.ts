"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface AdminThemeState {
  theme: Theme;
  toggle: () => void;
}

/**
 * Admin-dashboard-only theme preference ("Dark/Light Ready" per the
 * Phase 6 brief). Persisted separately from any storefront concept of
 * theme, since the storefront never enters dark mode — only
 * `admin/(dashboard)/layout.tsx` reads this and toggles the `.dark`
 * class (see `globals.css`) on its own root element.
 */
export const useAdminThemeStore = create<AdminThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    { name: "luxury-admin-theme" },
  ),
);
