// ──────────────────────────────────────────────
// Button — con nueva paleta de colores
// ──────────────────────────────────────────────

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-text-muted disabled:text-white/60',
  secondary:
    'bg-primary-light text-primary hover:bg-indigo-200 active:bg-indigo-300 disabled:bg-surface-border disabled:text-text-tertiary',
  outline:
    'border border-surface-border text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-canvas-alt disabled:border-surface-border-light disabled:text-text-muted',
  ghost:
    'text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-canvas-alt',
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-red-700 disabled:bg-red-300',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
