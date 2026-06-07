// ──────────────────────────────────────────────
// Dominion types — mirror del schema Prisma
// ──────────────────────────────────────────────

export interface User {
  id: string
  name: string | null
  email: string
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: string
  name: string
  description: string | null
  userId: string
  dailyExpenseLimit: number
  createdAt: string
  updatedAt: string
  /** Populated by backend hooks */
  members?: GroupMember[]
}

export interface GroupMember {
  id: string
  userId: string
  groupId: string
  role: 'admin' | 'member'
  joinedAt: string
  /** Populated by backend hooks */
  userData?: Pick<User, 'id' | 'name' | 'email'>
}

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  groupId: string
  paidById: string
  splitType: SplitType
  createdAt: string
  updatedAt: string
  /** Populated by backend hooks */
  group?: Pick<Group, 'id' | 'name'>
  /** Populated by backend hooks */
  payer?: Pick<User, 'id' | 'name' | 'email'>
  shares?: ExpenseShare[]
}

export interface ExpenseShare {
  id: string
  expenseId: string
  userId: string
  amount: number
  settled: boolean
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  permissions: PermissionItem[]
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  userId: string
  roleId: string
  assignedAt: string
}

// ──────────────────────────────────────────────
// Supporting types
// ──────────────────────────────────────────────

export type SplitType = 'equal' | 'percentage'

export interface PermissionItem {
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[]
  subject: string[]
}

export interface ApiError {
  name: string
  message: string
  code: number
  className: string
  errors?: Record<string, string[]>
}

// ──────────────────────────────────────────────
// API response shapes
// ──────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit?: number
  skip?: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    roles: { name: string; permissions: PermissionItem[] }[]
  }
}

export interface RegisterPayload {
  email: string
  password: string
}

// ──────────────────────────────────────────────
// Query params estilo Feathers
// ──────────────────────────────────────────────

export interface QueryParams {
  query?: Record<string, unknown>
  [key: string]: unknown
}
