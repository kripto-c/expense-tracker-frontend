// ──────────────────────────────────────────────
// Sidebar — navegación del dashboard
// ──────────────────────────────────────────────

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' },
  { label: 'Grupos', href: '/dashboard/groups', icon: '⊞' },
  { label: 'Gastos', href: '/dashboard/expenses', icon: '⊟' },
  { label: 'Perfil', href: '/dashboard/profile', icon: '◎' },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
        <span className="text-xl">◆</span>
        <span className="font-semibold text-zinc-900">ExpenseTracker</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 p-4">
        <p className="text-xs text-zinc-400">Expense Tracker v1</p>
      </div>
    </aside>
  )
}
