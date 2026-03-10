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
        title: 'Table Patterns and Filtering | TanStack Table + Router',
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
            Table Patterns Demo
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Home
            </Link>
            <Link
              to="/advanced-table-patterns"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Advanced Table Patterns
            </Link>
            <Link
              to="/advanced-filtering"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Advanced Filtering
            </Link>
          </nav>
        </div>
      </header>

      <main className="page-wrap py-8 flex-1">
        <Outlet />
      </main>

      <footer className="site-footer mt-8">
        <div className="page-wrap py-4 text-sm text-(--sea-ink-soft)">
          TanStack Start demo: advanced table patterns before advanced filtering
        </div>
      </footer>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
