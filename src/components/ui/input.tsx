// ──────────────────────────────────────────────
// Input — componente base atómico
// ──────────────────────────────────────────────

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-text-primary shadow-sm transition-colors',
            'placeholder:text-text-tertiary',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            'disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-text-tertiary',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
