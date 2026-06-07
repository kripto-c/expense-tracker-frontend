// ──────────────────────────────────────────────
// useAuth — hook de autenticación
// ──────────────────────────────────────────────

'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/lib/api/auth'
import type { LoginPayload, RegisterPayload } from '@/types'

export function useAuth() {
  const router = useRouter()
  const { token, user, roles, isAuthenticated, setAuth, clearAuth } =
    useAuthStore()

  const login = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        user: data.user,
        roles: data.user.roles,
      })
      router.push('/dashboard')
    },
  })

  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      router.push('/')
    },
  })

  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth()
      router.push('/')
    },
  })

  return {
    token,
    user,
    roles,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
