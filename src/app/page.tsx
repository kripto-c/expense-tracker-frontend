// ──────────────────────────────────────────────
// Login page
// ──────────────────────────────────────────────

'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { Button, Input, Card, CardHeader, CardTitle } from '@/components/ui'
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 text-3xl">◆</div>
          <CardTitle>Expense Tracker</CardTitle>
          <p className="mt-1 text-sm text-zinc-500">
            Iniciá sesión para continuar
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={login.isPending}
          >
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </div>
  )
}
