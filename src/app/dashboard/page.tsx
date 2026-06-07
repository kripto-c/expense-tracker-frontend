// ──────────────────────────────────────────────
// Dashboard home — resumen
// ──────────────────────────────────────────────

'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Resumen de tus grupos y gastos
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Grupos activos</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-zinc-900">—</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos este mes</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-zinc-900">—</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mi saldo</CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-zinc-900">—</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">
          Acá aparecerán los últimos movimientos cuando conectes los datos.
        </p>
      </Card>
    </div>
  )
}
