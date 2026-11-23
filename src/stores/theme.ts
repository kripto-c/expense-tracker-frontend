// ──────────────────────────────────────────────
// Store de tema — modo oscuro
// ──────────────────────────────────────────────
// Seguro para SSR: el script inline de layout.tsx asigna
// la clase en <html> antes de la hidratación. El store
// inicia con isDark=false (render del servidor) y
// el Header se sincroniza con el DOM tras el montaje.

import { create } from 'zustand'

const STORAGE_KEY = 'expense-tracker-theme'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  // Valor por defecto seguro para SSR — el useEffect del Header sincroniza tras el montaje
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
