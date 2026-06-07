// ──────────────────────────────────────────────
// Modal — reusable dialog con overlay
// ──────────────────────────────────────────────

'use client'

import { useEffect, useCallback, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  /** Footer con acciones (Button, etc) */
  footer?: ReactNode
  /** Tamaño del modal */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  // Focus trap — keep focus inside modal when open
  useEffect(() => {
    if (open && contentRef.current) {
      const firstFocusable = contentRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstFocusable?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'w-full animate-in fade-in zoom-in-95 rounded-xl border border-surface-border bg-surface p-6 shadow-2xl',
          sizeClasses[size],
          className,
        )}
        style={{
          animation: 'modal-in 0.15s ease-out',
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-5">
            {title && (
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-text-tertiary">{description}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="text-sm text-text-secondary">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-border pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
