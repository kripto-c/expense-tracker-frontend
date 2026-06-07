// ──────────────────────────────────────────────
// Theme store — dark mode
// ──────────────────────────────────────────────
// SSR-safe: inline script in layout.tsx sets the
// class on <html> before hydration. The store
// starts with isDark=false (server render) and
// the Header syncs with the DOM after mount.

import { create } from 'zustand'

const STORAGE_KEY = 'expense-tracker-theme'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  // SSR-safe default — Header useEfffect syncs after mount
  isDark: false,

  toggle: () =>
    set((state) => {
      const next = !state.isDark
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      }
      return { isDark: next }
    }),
}))
