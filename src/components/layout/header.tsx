// ──────────────────────────────────────────────
// Header — barra superior del dashboard
// ──────────────────────────────────────────────

'use client'

import { useAuth } from '@/hooks'
import { Button } from '@/components/ui'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">
          {user?.name || user?.email || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-500">{user?.email}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout.mutate()}
          loading={logout.isPending}
        >
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}
