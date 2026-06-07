// ──────────────────────────────────────────────
// Groups page — placeholder
// ──────────────────────────────────────────────

'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui'

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Grupos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Administrá tus grupos de gastos compartidos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus grupos</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">
          Acá se va a listar y crear los grupos. Usá <code>groupService</code> desde{' '}
          <code>src/lib/api/services.ts</code>.
        </p>
      </Card>
    </div>
  )
}
