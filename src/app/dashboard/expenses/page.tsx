// ──────────────────────────────────────────────
// Expenses page — placeholder
// ──────────────────────────────────────────────

'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui'

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Gastos</h2>
        <p className="mt-1 text-sm text-zinc-500">
      Todos los gastos de tus grupos
    </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus gastos</CardTitle>
        </CardHeader>
        <p className="text-sm text-zinc-500">
          Acá se van a listar, crear y editar gastos. Usá{' '}
          <code>expenseService</code> desde <code>src/lib/api/services.ts</code>.
        </p>
      </Card>
    </div>
  )
}
