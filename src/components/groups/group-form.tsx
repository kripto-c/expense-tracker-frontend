// ──────────────────────────────────────────────
// GroupForm — crear / editar grupo
// ──────────────────────────────────────────────

'use client'

import { useState, useEffect } from 'react'
import { Input, Button } from '@/components/ui'
import type { Group } from '@/types'

interface GroupFormData {
  name: string
  description: string
}

interface GroupFormProps {
  /** Grupo existente para editar. Omitir para crear. */
  group?: Group | null
  onSubmit: (data: GroupFormData) => Promise<void>
  onCancel: () => void
}

export function GroupForm({ group, onSubmit, onCancel }: GroupFormProps) {
  const isEditing = !!group
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del grupo al editar
  useEffect(() => {
    if (group) {
      setName(group.name)
      setDescription(group.description ?? '')
    }
  }, [group])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ name: trimmedName, description: description.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="group-name"
        label="Nombre del grupo"
        placeholder="Ej: Viaje a la playa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        error={error ?? undefined}
      />

      <div className="space-y-1">
        <label
          htmlFor="group-description"
          className="block text-sm font-medium text-text-secondary"
        >
          Descripción <span className="text-text-muted">(opcional)</span>
        </label>
        <textarea
          id="group-description"
          placeholder="Una breve descripción del grupo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
          className="block w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="text-xs text-text-muted">{description.length}/500</p>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {isEditing ? 'Guardar cambios' : 'Crear grupo'}
        </Button>
      </div>
    </form>
  )
}
