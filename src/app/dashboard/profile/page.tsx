// ──────────────────────────────────────────────
// Profile page — placeholder
// ──────────────────────────────────────────────

'use client'

import { useAuth } from '@/hooks'
import { Card, CardHeader, CardTitle } from '@/components/ui'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Perfil</h2>
        <p className="mt-1 text-sm text-text-tertiary">Tu información de cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        {user ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Nombre</p>
              <p className="text-sm text-text-primary">{user.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">Email</p>
              <p className="text-sm text-text-primary">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">Cargando...</p>
        )}
      </Card>
    </div>
  )
}
