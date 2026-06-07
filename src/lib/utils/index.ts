export { cn } from './cn'

/** Formatea monto como moneda */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

/** Formatea fecha ISO a locale */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
  }).format(new Date(iso))
}

/** Formatea fecha corta */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'short',
  }).format(new Date(iso))
}
