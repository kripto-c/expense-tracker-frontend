// ──────────────────────────────────────────────
// Groups page — listado + modal crear/editar
// ──────────────────────────────────────────────

'use client'

import { useState, useCallback } from 'react'
import { Button, Table, Modal } from '@/components/ui'
import { GroupForm } from '@/components/groups/group-form'
import type { Column, SortState } from '@/components/ui'
import { groupService } from '@/lib/api/services'
import { useFind, useServiceMutation } from '@/hooks/useService'
import { formatCurrency } from '@/lib/utils'
import type { Group } from '@/types'
import { toast } from 'react-hot-toast'

// ── Hook personalizado: manejo del modal ──────

function useGroupModal() {
  const [state, setState] = useState<{
    open: boolean
    group?: Group | null
  }>({ open: false, group: null })

  const openCreate = useCallback(() => setState({ open: true, group: null }), [])
  const openEdit = useCallback((group: Group) => setState({ open: true, group }), [])
  const close = useCallback(() => setState({ open: false, group: null }), [])

  return { ...state, openCreate, openEdit, close }
}

// ── Página ────────────────────────────────────

export default function GroupsPage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)
  const modal = useGroupModal()

  const queryParams: Record<string, unknown> = {
    $skip: (page - 1) * 10,
    $limit: 10,
  }
  if (sort) {
    queryParams.$sort = { [sort.key]: sort.direction === 'asc' ? 1 : -1 }
  }

  const { data, isLoading } = useFind(
    ['groups', { page, sort }],
    () => groupService.find(queryParams),
  )

  const createGroup = useServiceMutation(
    (form: { name: string; description: string }) =>
      groupService.create(form),
    [['groups']],
  )

  const updateGroup = useServiceMutation(
    ({ id, data: form }: { id: string; data: { name: string; description: string } }) =>
      groupService.patch(id, form),
    [['groups']],
  )

  const handleSubmit = async (form: { name: string; description: string }) => {
    if (modal.group) {
      await updateGroup.mutateAsync({ id: modal.group.id, data: form })
      toast.success('Grupo actualizado')
    } else {
      await createGroup.mutateAsync(form)
      toast.success('Grupo creado')
    }
    modal.close()
  }

  // Columnas definidas adentro para acceder a modal.openEdit
  const columns: Column<Group>[] = [
    {
      key: 'name',
      title: 'Nombre',
      dataIndex: 'name',
      sortable: true,
    },
    {
      key: 'description',
      title: 'Descripción',
      dataIndex: 'description',
      className: 'hidden md:table-cell max-w-xs',
    },
    {
      key: 'dailyExpenseLimit',
      title: 'Límite diario',
      dataIndex: 'dailyExpenseLimit',
      render: (value) => (
        <span className="font-medium tabular-nums text-text-primary">
          {formatCurrency(value as number)}
        </span>
      ),
      className: 'hidden sm:table-cell',
    },
    {
      key: 'createdAt',
      title: 'Creado',
      dataIndex: 'createdAt',
      render: (value) => (
        <span className="text-text-tertiary">
          {new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(
            new Date(value as string),
          )}
        </span>
      ),
      sortable: true,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'actions',
      title: 'Acciones',
      width: 80,
      className: 'text-center',
      render: (_value, record) => (
        <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => modal.openEdit(record)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-primary"
            title="Editar grupo"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Grupos</h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Administrá tus grupos de gastos compartidos
          </p>
        </div>
        <Button onClick={modal.openCreate}>+ Nuevo grupo</Button>
      </div>

      <Table<Group>
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
        onRowClick={(group) => modal.openEdit(group)}
        emptyText="No tenés grupos todavía — creá uno nuevo"
      />

      {/* Modal crear/editar */}
      <Modal
        open={modal.open}
        onClose={modal.close}
        title={modal.group ? 'Editar grupo' : 'Nuevo grupo'}
        description={
          modal.group
            ? 'Modificá los datos del grupo'
            : 'Creá un grupo para compartir gastos'
        }
      >
        <GroupForm
          key={modal.group?.id ?? 'create'}
          group={modal.group}
          onSubmit={handleSubmit}
          onCancel={modal.close}
        />
      </Modal>
    </div>
  )
}
