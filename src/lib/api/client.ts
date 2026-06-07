// ──────────────────────────────────────────────
// API client — ky instance
// Usa URL relativa /api/* → Next.js rewrite →
// http://localhost:3000/api/* (sin CORS)
// ──────────────────────────────────────────────

import ky, { isHTTPError } from 'ky'

export const api = ky.create({
  prefix: '/api',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeError: [
      (state) => {
        const { error } = state
        if (isHTTPError(error)) {
          const data = error.data as { message?: string } | undefined
          return new Error(data?.message || error.response.statusText)
        }
        return error
      },
    ],
  },
})

/** Cliente sin cookie — para SSR con token explícito */
export function createAuthClient(token: string) {
  return ky.create({
    prefix: '/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}
