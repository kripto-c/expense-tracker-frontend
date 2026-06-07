// ──────────────────────────────────────────────
// Profile page — placeholder
// ──────────────────────────────────────────────

'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Perfil</h2>
        <p className="mt-1 text-sm text-zinc-500">Tu información de cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">
          Acá vas a poder ver y editar tu perfil.
        </p>
      </Card>
    </div>
  )
}
