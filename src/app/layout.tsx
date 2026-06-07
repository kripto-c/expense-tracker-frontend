import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const themeScript = `
(function() {
  var stored = localStorage.getItem('expense-tracker-theme');
  var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) document.documentElement.classList.add('dark');
})()
`

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Gestión de gastos compartidos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
