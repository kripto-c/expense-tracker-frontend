# Expense Tracker — Frontend

Frontend para la aplicación de gestión de gastos compartidos. Construido con Next.js 16 App Router, Tailwind CSS v4 y TypeScript estricto.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Estilos | Tailwind CSS v4 con tokens de tema vía CSS variables |
| Estado global | Zustand v5 |
| Server state | TanStack Query v5 |
| HTTP client | ky v2 |
| Fuente | Inter (Google Fonts) |
| Notificaciones | react-hot-toast |

## Requisitos

- Node.js 24.22.3+
- pnpm
- Backend corriendo en `http://localhost:3000` ([expense-tracker-api](https://github.com/...))

## Getting Started

```bash
pnpm install
pnpm dev --port 3001
```

El frontend arranca en **http://localhost:3001**. Los requests a `/api/*` se redirigen al backend en `http://localhost:3000/api/*` vía Next.js rewrites.

Si el build está cacheado con CSS viejo, borrar el caché antes de arrancar:

```bash
rm -rf .next && pnpm dev --port 3001
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Login |
| `/auth/register` | Registro |
| `/dashboard` | Dashboard principal |
| `/dashboard/groups` | CRUD de grupos |
| `/dashboard/expenses` | CRUD de gastos |
| `/dashboard/profile` | Perfil de usuario |

El middleware (`src/proxy.ts`) protege las rutas del dashboard y redirige a `/` si no hay token.

## Features

- **Autenticación** — login, registro, logout con JWT vía cookies
- **Dark mode** — toggle con persistencia en localStorage, inline script anti-flash, SSR-safe
- **Sidebar colapsable** — navegación principal con iconos
- **CRUD de grupos** — modal reutilizable, formularios controlados
- **CRUD de gastos** — tabla con acciones, split types, tooltips
- **Paleta indigo** — sistema de colores personalizado vía CSS variables con overrides para dark mode

## Arquitectura

```
src/
├── app/            # Next.js App Router pages
│   ├── auth/register/
│   ├── dashboard/
│   │   ├── expenses/
│   │   ├── groups/
│   │   └── profile/
│   └── page.tsx    # Login (raíz)
├── components/
│   ├── layout/     # Header, Sidebar
│   ├── groups/     # GroupForm, etc.
│   └── ui/         # Button, Card, Input, Modal, Table
├── hooks/          # useAuth, useService
├── lib/
│   ├── api/        # API client (ky) + auth endpoints
│   └── utils/      # cn() helper
├── stores/         # Zustand stores (auth, theme, layout)
└── types/          # TypeScript interfaces
```

## Estructura de estilos

Las variables de color se definen en `src/app/globals.css` usando CSS nativo:

- `:root` — valores del tema claro
- `.dark` — overrides para modo oscuro
- `@theme` — mapeo de tokens de Tailwind a las variables CSS

## Backend

El backend esperado es una API REST en Express con los siguientes endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/groups` (y CRUD completo)
- `GET /api/expenses` (y CRUD completo)
- Autenticación via JWT en cookie `token`
