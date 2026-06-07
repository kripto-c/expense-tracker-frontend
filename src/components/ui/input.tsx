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
          <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-zinc-400',
            'focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400',
            'disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-400',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
