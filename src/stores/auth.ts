// ──────────────────────────────────────────────
// Auth store — Zustand
// ──────────────────────────────────────────────

import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  /** Token JWT actual (se persiste en localStorage para SSR) */
  token: string | null
  user: User | null
  roles: { name: string; permissions: { actions: string[]; subject: string[] }[] }[]
  isAuthenticated: boolean

  setAuth: (payload: {
    accessToken: string
    user: { id: string; email: string }
    roles: AuthState['roles']
  }) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

const STORAGE_KEY = 'expense-tracker-auth'

function loadFromStorage(): Pick<AuthState, 'token' | 'user' | 'roles'> {
  if (typeof window === 'undefined') {
    return { token: null, user: null, roles: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null, roles: [] }
    return JSON.parse(raw)
  } catch {
    return { token: null, user: null, roles: [] }
  }
}

function saveToStorage(state: Pick<AuthState, 'token' | 'user' | 'roles'>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadFromStorage(),
  isAuthenticated: !!loadFromStorage().token,

  setAuth: ({ accessToken, user, roles }) => {
    const payload = {
      token: accessToken,
      user: user as User,
      roles,
    }
    saveToStorage(payload)
    set({ ...payload, isAuthenticated: true })
  },

  setUser: (user) => {
    set((state) => {
      const updated = { ...state, user }
      saveToStorage({ token: state.token, user, roles: state.roles })
      return updated
    })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    set({ token: null, user: null, roles: [], isAuthenticated: false })
  },
}))
