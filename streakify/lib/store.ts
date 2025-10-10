"use client";

import { create } from "zustand";

type UIState = {
  workspaceId?: string;
  setWorkspaceId: (id?: string) => void;
  activeTheme: "light" | "dark" | "custom";
  setActiveTheme: (theme: "light" | "dark" | "custom") => void;
};

export const useUIStore = create<UIState>((set) => ({
  workspaceId: undefined,
  activeTheme: "light",
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
  setActiveTheme: (activeTheme) => set({ activeTheme })
}));
