import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  phone: string;
  countryCode: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;

  // UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "gemini-chat-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
