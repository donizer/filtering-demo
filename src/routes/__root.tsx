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

const shellContainerClass = 'mx-auto w-full max-w-[1220px] px-4 md:px-5'

const navLinkClass =
  'relative text-(--sea-ink-soft) no-underline transition-[color] duration-180 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[linear-gradient(90deg,var(--lagoon),#7ed3bf)] after:transition-transform after:duration-170 hover:text-(--sea-ink) hover:after:scale-x-100'

const navLinkActiveClass = `${navLinkClass} text-(--sea-ink) after:scale-x-100`

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-(--line) bg-(--header-bg) backdrop-blur-md">
        <div
          className={`${shellContainerClass} flex flex-wrap items-center justify-between gap-3 py-3.5`}
        >
          <Link
            to="/"
            className="display-title text-lg font-semibold tracking-tight text-(--sea-ink) no-underline"
          >
            Демо патернів таблиць
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium md:gap-5">
            <Link
              to="/"
              className={navLinkClass}
              activeProps={{ className: navLinkActiveClass }}
            >
              Головна
            </Link>
            <Link
              to="/advanced-table-patterns"
              className={navLinkClass}
              activeProps={{ className: navLinkActiveClass }}
            >
              Патерни таблиць
            </Link>
            <Link
              to="/advanced-filtering"
              className={navLinkClass}
              activeProps={{ className: navLinkActiveClass }}
            >
              Фільтрація
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-5 md:py-6">
        <Outlet />
      </main>

      <footer className="site-footer mt-5 md:mt-6">
        <div
          className={`${shellContainerClass} py-4 text-sm text-(--sea-ink-soft)`}
        >
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
