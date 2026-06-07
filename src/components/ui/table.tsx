// ──────────────────────────────────────────────
// Table — reusable generic data table
// API style: Ant Design Table patterns
// Styling: minimal, clean, consistent with project
// ──────────────────────────────────────────────

'use client'

import { cn } from '@/lib/utils'
import { useCallback, useMemo, useRef, useEffect, type ReactNode, type ComponentPropsWithoutRef } from 'react'

// ── Types ──────────────────────────────────────

export interface Column<T> {
  /** Unique identifier for the column */
  key: string
  /** Header text */
  title: string
  /** Key into the record to extract the cell value (optional if using render) */
  dataIndex?: keyof T
  /** Enable click-to-sort on this column */
  sortable?: boolean
  /** Fixed width (px or percentage) */
  width?: number | string
  /** Additional class for both header and cells in this column */
  className?: string
  /** Custom render function. Receives (value, record, index) */
  render?: (value: unknown, record: T, index: number) => ReactNode
}

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: string
  direction: SortDirection
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  /** Key extractor — defaults to `record.id` */
  rowKey?: keyof T | ((record: T) => string)
  /** Show loading skeleton */
  loading?: boolean
  /** Bottom pagination. Omit to hide. */
  pagination?: PaginationConfig
  /** Current sort state (controlled) */
  sort?: SortState | null
  /** Called when a sortable header is clicked */
  onSort?: (key: string, direction: SortDirection) => void
  /** Called when a row body is clicked */
  onRowClick?: (record: T) => void
  /** Selected row keys for checkbox selection */
  selectedRowKeys?: string[]
  /** Called when selection changes */
  onSelectionChange?: (keys: string[]) => void
  /** Text when data is empty */
  emptyText?: string
  className?: string
  /** Props passed to the wrapping div */
  wrapperProps?: ComponentPropsWithoutRef<'div'>
}

// ── Helpers ────────────────────────────────────

function getRowKey<T>(record: T, rowKey?: keyof T | ((r: T) => string)): string {
  if (typeof rowKey === 'function') return rowKey(record)
  if (rowKey) return String(record[rowKey])
  return String((record as Record<string, unknown>).id ?? '')
}

function getCellValue<T>(record: T, column: Column<T>): unknown {
  if (column.dataIndex) return record[column.dataIndex]
  if (column.key in (record as Record<string, unknown>)) {
    return (record as Record<string, unknown>)[column.key]
  }
  return undefined
}

// ── Sort Arrows ────────────────────────────────

function SortIcon({
  direction,
  active,
}: {
  direction: SortDirection
  active: boolean
}) {
  return (
    <span className="ml-1.5 inline-flex flex-col" aria-hidden>
      <svg
        className={cn(
          'h-2.5 w-2.5 -mb-px',
          active && direction === 'asc' ? 'text-text-primary' : 'text-text-muted',
        )}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg
        className={cn(
          'h-2.5 w-2.5',
          active && direction === 'desc' ? 'text-text-primary' : 'text-text-muted',
        )}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0h10z" />
      </svg>
    </span>
  )
}

// ── Pagination ─────────────────────────────────

function Pagination({ page, pageSize, total, onChange }: PaginationConfig) {
  const totalPages = Math.ceil(total / pageSize)

  const pages = useMemo(() => {
    const items: (number | '...')[] = []
    const delta = 2

    const start = Math.max(1, page - delta)
    const end = Math.min(totalPages, page + delta)

    if (start > 1) items.push(1)
    if (start > 2) items.push('...')
    for (let i = start; i <= end; i++) items.push(i)
    if (end < totalPages - 1) items.push('...')
    if (end < totalPages) items.push(totalPages)

    return items
  }, [page, totalPages])

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  if (totalPages <= 1 && total <= pageSize) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-border px-4 py-3">
      <p className="text-sm text-text-tertiary">
        <span className="font-medium text-text-secondary">{from}</span>
        {' – '}
        <span className="font-medium text-text-secondary">{to}</span>
        {' de '}
        <span className="font-medium text-text-secondary">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Paginación">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
            page <= 1
              ? 'cursor-not-allowed text-text-muted'
              : 'text-text-secondary hover:bg-surface-hover active:bg-surface-border-light',
          )}
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`e${i}`}
              className="inline-flex h-8 w-8 items-center justify-center text-sm text-text-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-medium transition-colors',
                p === page
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-surface-hover active:bg-surface-border-light',
              )}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Ir a página ${p}`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
            page >= totalPages
              ? 'cursor-not-allowed text-text-muted'
              : 'text-text-secondary hover:bg-surface-hover active:bg-surface-border-light',
          )}
          aria-label="Página siguiente"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  )
}

export { Pagination as TablePagination }

// ── Loading Skeleton ───────────────────────────

function TableSkeleton({
  colCount,
  rowCount = 5,
}: {
  colCount: number
  rowCount?: number
}) {
  return (
    <tbody className="animate-pulse">
      {Array.from({ length: rowCount }).map((_, r) => (
        <tr key={r} className="border-b border-surface-border-light last:border-0">
          {Array.from({ length: colCount }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <div
                className="h-4 rounded bg-surface-border-light"
                style={{ width: `${50 + Math.random() * 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

// ── Empty State ────────────────────────────────

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tbody>
      <tr>
        <td
          colSpan={colSpan}
          className="px-4 py-16 text-center text-sm text-text-tertiary"
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-8 w-8 text-text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>{text}</span>
          </div>
        </td>
      </tr>
    </tbody>
  )
}

// ── Checkbox ───────────────────────────────────

function RowCheckbox({
  checked,
  indeterminate,
  onChange,
  onClick,
  id,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  onClick?: (e: React.MouseEvent) => void
  id?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate === true
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      id={id}
      className="h-4 w-4 rounded border-text-muted text-text-primary focus:ring-2 focus:ring-text-tertiary focus:ring-offset-1"
    />
  )
}

// ── Main Component ─────────────────────────────

export function Table<T extends object>({
  columns,
  data,
  rowKey,
  loading = false,
  pagination,
  sort,
  onSort,
  onRowClick,
  selectedRowKeys,
  onSelectionChange,
  emptyText = 'Sin datos',
  className,
  wrapperProps,
}: TableProps<T>) {
  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) return
      const isActive = sort?.key === key
      const newDir: SortDirection =
        isActive && sort.direction === 'asc' ? 'desc' : 'asc'
      onSort(key, newDir)
    },
    [onSort, sort],
  )

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return
    if (selectedRowKeys && selectedRowKeys.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map((r) => getRowKey(r, rowKey)))
    }
  }, [onSelectionChange, selectedRowKeys, data, rowKey])

  const handleRowSelect = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.stopPropagation()
      if (!onSelectionChange || !selectedRowKeys) return
      const next = selectedRowKeys.includes(key)
        ? selectedRowKeys.filter((k) => k !== key)
        : [...selectedRowKeys, key]
      onSelectionChange(next)
    },
    [onSelectionChange, selectedRowKeys],
  )

  const showSelection = !!selectedRowKeys && !!onSelectionChange
  const colSpan = columns.length + (showSelection ? 1 : 0)
  const selectAllChecked =
    data.length > 0 && selectedRowKeys?.length === data.length
  const selectAllIndeterminate =
    selectedRowKeys && selectedRowKeys.length > 0 && selectedRowKeys.length < data.length

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-surface-border bg-surface shadow-sm',
        className,
      )}
      {...wrapperProps}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* ── HEAD ──────────────────────────── */}
          <thead className="bg-surface-hover">
            <tr>
              {showSelection && (
                <th className="w-10 px-4 py-3">
                  <RowCheckbox
                    checked={selectAllChecked}
                    indeterminate={selectAllIndeterminate}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const canSort = col.sortable && !!onSort
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary',
                      canSort &&
                        'cursor-pointer select-none hover:text-text-secondary',
                      col.className,
                    )}
                    onClick={canSort ? () => handleSort(col.key) : undefined}
                    scope="col"
                    aria-sort={
                      sort?.key === col.key
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.title}
                      {col.sortable && (
                        <SortIcon
                          direction={sort?.direction ?? 'asc'}
                          active={sort?.key === col.key}
                        />
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* ── BODY ──────────────────────────── */}
          {loading ? (
            <TableSkeleton
              colCount={columns.length + (showSelection ? 1 : 0)}
            />
          ) : data.length === 0 ? (
            <EmptyRow colSpan={colSpan} text={emptyText} />
          ) : (
            <tbody>
              {data.map((record, index) => {
                const key = getRowKey(record, rowKey)
                const isSelected = selectedRowKeys?.includes(key)

                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-surface-border-light transition-colors last:border-0',
                      onRowClick && 'cursor-pointer',
                      'hover:bg-surface-hover',
                      isSelected && 'bg-surface-hover',
                    )}
                    onClick={() => onRowClick?.(record)}
                  >
                    {showSelection && (
                      <td className="px-4 py-3">
                        <RowCheckbox
                          checked={!!isSelected}
                          onChange={() => {}}
                          onClick={(e) => handleRowSelect(key, e)}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = getCellValue(record, col)
                      return (
                        <td
                          key={col.key}
                          className={cn('px-4 py-3 text-sm text-text-secondary', col.className)}
                        >
                          {col.render ? (
                            col.render(value, record, index)
                          ) : (
                            <span className="truncate">
                              {value !== null && value !== undefined
                                ? String(value)
                                : '—'}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* ── PAGINATION ───────────────────────── */}
      {pagination && <Pagination {...pagination} />}
    </div>
  )
}
