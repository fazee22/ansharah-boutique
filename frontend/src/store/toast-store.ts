"use client";

import { create } from "zustand";

export interface ToastItem {
  id: string;
  message: string;
  variant: "default" | "success" | "error" | "warning" | "info";
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, variant?: ToastItem["variant"]) => void;
  dismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 3200;

/**
 * Minimal global toast queue — used by "Add to Cart," "Copy Product
 * Link," and anywhere else a brief, non-blocking confirmation is
 * needed rather than a full modal. `Toaster` (rendered once in
 * `app/layout.tsx`) is the only consumer of `toasts`; every other
 * component just calls `useToastStore.getState().show(...)`.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, variant = "default") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));

    setTimeout(() => get().dismiss(id), AUTO_DISMISS_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

/** Convenience export so callers can `import { toast } from "@/store/toast-store"` instead of the full store hook. */
export const toast = (message: string, variant?: ToastItem["variant"]) =>
  useToastStore.getState().show(message, variant);
