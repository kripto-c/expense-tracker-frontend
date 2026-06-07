// ──────────────────────────────────────────────
// Expenses page — listado con Table reusable
// ──────────────────────────────────────────────

'use client'

import { useState } from 'react'
import { Button, Table } from '@/components/ui'
import type { Column, SortState } from '@/components/ui'
import { expenseService } from '@/lib/api/services'
import { useFind } from '@/hooks/useService'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import type { Expense } from '@/types'
import { toast } from 'react-hot-toast'

const columns: Column<Expense>[] = [
  {
    key: 'description',
    title: 'Descripción',
    dataIndex: 'description',
    sortable: true,
  },
  {
    key: 'amount',
    title: 'Monto',
    dataIndex: 'amount',
    render: (value) => (
      <span className="font-medium tabular-nums text-text-primary">
        {formatCurrency(value as number)}
      </span>
    ),
    sortable: true,
    className: 'hidden sm:table-cell',
  },
  {
    key: 'date',
    title: 'Fecha',
    dataIndex: 'date',
    render: (value) => (
      <span className="text-text-tertiary">{formatShortDate(value as string)}</span>
    ),
    sortable: true,
  },
  {
    key: 'group',
    title: 'Grupo',
    dataIndex: 'group',
    render: (value) => {
      const group = value as { name: string } | undefined
      return <span className="text-text-tertiary">{group?.name ?? '—'}</span>
    },
    className: 'hidden lg:table-cell',
  },
  {
    key: 'payer',
    title: 'Pagó',
    dataIndex: 'payer',
    render: (value) => {
      const payer = value as { name?: string; email: string } | undefined
      return (
        <span className="text-text-tertiary">{payer?.name ?? payer?.email ?? '—'}</span>
      )
    },
    className: 'hidden md:table-cell',
  },
  {
    key: 'actions',
    title: 'Acciones',
    width: 80,
    className: 'text-center',
    render: (_value, record) => (
      <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toast.success(`Editar: ${record.description}`)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-primary"
          title="Editar gasto"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    ),
  },
]

export default function ExpensesPage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)

  const queryParams: Record<string, unknown> = {
    $skip: (page - 1) * 10,
    $limit: 10,
  }
  if (sort) {
    queryParams.$sort = { [sort.key]: sort.direction === 'asc' ? 1 : -1 }
  }

  const { data, isLoading } = useFind(
    ['expenses', { page, sort }],
    () => expenseService.find(queryParams),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Gastos</h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Todos los gastos de tus grupos
          </p>
        </div>
        <Button onClick={() => toast.success('Crear gasto — pronto')}>
          + Nuevo gasto
        </Button>
      </div>

      <Table<Expense>
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        rowKey="id"
        sort={sort}
        onSort={(key, dir) => setSort({ key, direction: dir })}
        pagination={{
          page,
          pageSize: 10,
          total: data?.total ?? 0,
          onChange: setPage,
        }}
        onRowClick={(expense) => toast.success(`Gasto: ${expense.description}`)}
        emptyText="No hay gastos todavía — creá uno nuevo"
      />
    </div>
  )
}
