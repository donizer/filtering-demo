import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Патерни таблиць і фільтрація | TanStack Table + Router',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-(--line) bg-(--header-bg) backdrop-blur-md">
        <div className="page-wrap flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            to="/"
            className="display-title text-lg font-semibold tracking-tight text-(--sea-ink) no-underline"
          >
            Демо патернів таблиць
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Головна
            </Link>
            <Link
              to="/advanced-table-patterns"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Патерни таблиць
            </Link>
            <Link
              to="/advanced-filtering"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Фільтрація
            </Link>
          </nav>
        </div>
      </header>

      <main className="page-wrap py-8 flex-1">
        <Outlet />
      </main>

      <footer className="site-footer mt-8">
        <div className="page-wrap py-4 text-sm text-(--sea-ink-soft)">
          Навчальне демо TanStack Start: спочатку патерни таблиць, потім
          просунута фільтрація
        </div>
      </footer>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <TanStackQueryProvider>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
