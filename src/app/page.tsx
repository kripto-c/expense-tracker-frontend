// ──────────────────────────────────────────────
// Login page — con nueva paleta
// ──────────────────────────────────────────────

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks'
import { Button, Input, Card } from '@/components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Completá todos los campos')
      return
    }

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          const message = err.message || 'Error al iniciar sesión'
          setError(message)
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-4">
      {/* Background decorative */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm border-surface-border/50 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <span className="text-xl font-bold text-white">E</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary">Expense Tracker</h1>
          <p className="mt-1 text-sm text-text-tertiary">
            Iniciá sesión para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? ' ' : undefined}
          />

          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && error !== ' ' && (
            <div className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={login.isPending}
          >
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-tertiary">
          ¿No tenés cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
