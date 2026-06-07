// ──────────────────────────────────────────────
// Auth API — register, login, logout
// ──────────────────────────────────────────────

import { api } from './client'
import type { LoginPayload, LoginResponse, RegisterPayload } from '@/types'

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post('auth/register', { json: payload }).json<Omit<LoginResponse, 'accessToken'>>(),

  login: (payload: LoginPayload) =>
    api.post('auth/login', { json: payload }).json<LoginResponse>(),

  logout: () => api.post('auth/logout').json<{ message: string }>(),
}
