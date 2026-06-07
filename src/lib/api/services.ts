// ──────────────────────────────────────────────
// Resource services — mirrors the backend endpoints
// ──────────────────────────────────────────────

import { api, createAuthClient } from './client'
import type {
  Group,
  Expense,
  User,
  Role,
  GroupMember,
  PaginatedResponse,
} from '@/types'

// ── Helpers ──────────────────────────────────

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'object') {
      search.set(key, JSON.stringify(value))
    } else {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// ── Generic service factory ──────────────────

function createService<T>(resource: string) {
  return {
    find: (params?: Record<string, unknown>): Promise<PaginatedResponse<T>> =>
      api.get(`${resource}${buildQuery(params)}`).json(),

    get: (id: string, params?: Record<string, unknown>): Promise<T> =>
      api.get(`${resource}/${id}${buildQuery(params)}`).json(),

    create: (data: Partial<T>): Promise<T> =>
      api.post(resource, { json: data }).json(),

    patch: (id: string, data: Partial<T>): Promise<T> =>
      api.patch(`${resource}/${id}`, { json: data }).json(),

    remove: (id: string): Promise<void> =>
      api.delete(`${resource}/${id}`).then(() => undefined),
  }
}

// ── Specific services ────────────────────────

export const groupService = {
  ...createService<Group>('groups'),
  /** Obtiene miembros de un grupo */
  getMembers: (groupId: string) =>
    api.get(`groups/${groupId}/members`).json<PaginatedResponse<GroupMember>>(),
  /** Agrega un miembro al grupo */
  addMember: (groupId: string, userId: string, role: GroupMember['role'] = 'member') =>
    api.post(`groups/${groupId}/members`, { json: { userId, role } }).json<GroupMember>(),
}

export const expenseService = createService<Expense>('expenses')

export const userService = {
  ...createService<User>('users'),
  getRoles: (userId: string) => api.get(`users/${userId}/roles`).json(),
}

export const roleService = createService<Role>('roles')

/** Cliente autenticado para SSR — requiere token explícito */
export function createServerClient(token: string) {
  const client = createAuthClient(token)
  return {
    group: {
      ...createService<Group>('groups'),
      getMembers: (groupId: string) =>
        client.get(`groups/${groupId}/members`).json<PaginatedResponse<GroupMember>>(),
    },
    expense: createService<Expense>('expenses'),
    user: createService<User>('users'),
    role: createService<Role>('roles'),
  }
}
