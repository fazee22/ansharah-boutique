"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT_SEARCHES = 6;

interface RecentSearchesState {
  queries: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
}

/** Persisted recent-search history (Phase 8) — shown in the search overlay/page when the input is empty, so returning to a search doesn't mean retyping it. */
export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      queries: [],
      add: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          queries: [trimmed, ...state.queries.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
            0,
            MAX_RECENT_SEARCHES,
          ),
        }));
      },
      remove: (query) => set((state) => ({ queries: state.queries.filter((q) => q !== query) })),
      clear: () => set({ queries: [] }),
    }),
    { name: "luxury-recent-searches" },
  ),
);
