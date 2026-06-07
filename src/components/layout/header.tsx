// ──────────────────────────────────────────────
// Header — barra superior con menú usuario y notificaciones
// ──────────────────────────────────────────────

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks'
import { useLayoutStore } from '@/stores/layout'
import { useThemeStore } from '@/stores/theme'
import { cn } from '@/lib/utils'

// ── Hydration-safe theme toggle ───────────────

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { isDark, toggle } = useThemeStore()

  useEffect(() => {
    // Sync store with the class set by the inline <script> in layout.tsx
    const domIsDark = document.documentElement.classList.contains('dark')
    if (domIsDark !== isDark) {
      useThemeStore.setState({ isDark: domIsDark })
    }
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9" /> // spacer while not hydrated
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

// ── Hook: click outside ───────────────────────

function useClickOutside<T extends HTMLElement>(
  handler: () => void,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [handler])

  return ref
}

// ── Notificaciones placeholder ────────────────

const notifications = [
  {
    id: '1',
    title: 'Nuevo gasto agregado',
    description: 'Alice agregó "Cena" al grupo Viaje',
    time: 'hace 5 min',
    unread: true,
  },
  {
    id: '2',
    title: 'Miembro agregado',
    description: 'Bob se unió al grupo Casa',
    time: 'hace 2 hs',
    unread: true,
  },
  {
    id: '3',
    title: 'Gasto liquidado',
    description: 'Carlos liquidó su parte de "Supermercado"',
    time: 'hace 1 día',
    unread: false,
  },
]

// ── Dropdown wrapper ──────────────────────────

function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
  closeOnClick = true,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
  closeOnClick?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(useCallback(() => setOpen(false), []))

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center rounded-lg transition-colors hover:bg-surface-hover"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div
          onClick={closeOnClick ? () => setOpen(false) : undefined}
          className={cn(
            'absolute top-full mt-2 w-72 rounded-xl border border-surface-border bg-surface p-1.5 shadow-lg ring-1 ring-black/5',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary',
        className,
      )}
    >
      {children}
    </button>
  )
}

function DropdownSeparator() {
  return <div className="my-1 border-t border-surface-border" />
}

// ── Header ────────────────────────────────────

export function Header() {
  const { user, logout } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-surface px-4 lg:px-6">
      {/* Left — toggle sidebar */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
          aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sidebarCollapsed ? (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <line x1="9" y1="18" x2="15" y2="12" />
                <line x1="9" y1="6" x2="15" y2="12" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Right — theme + notifications + user */}
      <div className="flex items-center gap-1">

        {/* ── Theme toggle ── */}
        <ThemeToggle />
        {/* ── Notifications ── */}
        <Dropdown
          trigger={
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {notifications.some((n) => n.unread) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
              )}
            </div>
          }
          className="w-80"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-text-primary">Notificaciones</span>
            {notifications.some((n) => n.unread) && (
              <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                {notifications.filter((n) => n.unread).length} nuevas
              </span>
            )}
          </div>
          <DropdownSeparator />
          <div className="max-h-64 space-y-0.5 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-text-tertiary">
                No tenés notificaciones
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={cn(
                    'flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-hover',
                    n.unread && 'bg-primary-light/30',
                  )}
                >
                  <div
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      n.unread ? 'bg-primary' : 'bg-text-muted',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'truncate text-sm',
                        n.unread ? 'font-medium text-text-primary' : 'text-text-secondary',
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-text-tertiary">{n.description}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{n.time}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Dropdown>

        {/* ── User dropdown ── */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-hover">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                {initials}
              </div>
              <svg
                className="h-4 w-4 text-text-tertiary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          }
          className="w-56"
        >
          {/* User info */}
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-text-primary">
              {user?.name || 'Usuario'}
            </p>
            <p className="truncate text-xs text-text-tertiary">{user?.email}</p>
          </div>

          <DropdownSeparator />

          <Link
            href="/dashboard/profile"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mi perfil
          </Link>

          <DropdownSeparator />

          <DropdownItem onClick={() => logout.mutate()} className="text-danger hover:bg-danger-light hover:text-danger">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
