"use client";

import { create } from "zustand";

/**
 * Single source of truth for which view the user is in.
 * Both marketing and workspace live on `/` and toggle via this store.
 */
type View = "marketing" | "workspace";

interface ViewStore {
  view: View;
  openWorkspace: () => void;
  backToMarketing: () => void;
}

export const useView = create<ViewStore>((set) => ({
  view: "marketing",
  openWorkspace: () => {
    set({ view: "workspace" });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  backToMarketing: () => {
    set({ view: "marketing" });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
}));
