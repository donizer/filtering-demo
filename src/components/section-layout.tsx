import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type SectionNavItem = {
  to: string
  label: string
  description: string
}

interface SectionLayoutProps {
  kicker: string
  title: string
  description: string
  items: readonly SectionNavItem[]
  children: ReactNode
}

export function SectionLayout({
  kicker,
  title,
  description,
  items,
  children,
}: SectionLayoutProps) {
  return (
    <section className="space-y-6">
      <div className="island-shell rounded-2xl p-6 md:p-8">
        <p className="island-kicker">{kicker}</p>
        <h1 className="display-title mt-2 text-3xl font-semibold tracking-tight text-(--sea-ink) md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-(--sea-ink-soft)">{description}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="feature-card rounded-2xl border border-(--line) p-4 no-underline"
              activeProps={{
                className:
                  'feature-card rounded-2xl border border-(--line) p-4 no-underline ring-2 ring-[rgba(79,184,178,0.24)]',
              }}
            >
              <div className="text-sm font-semibold text-(--sea-ink)">
                {item.label}
              </div>
              <p className="mt-2 text-sm text-(--sea-ink-soft)">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {children}
    </section>
  )
}
