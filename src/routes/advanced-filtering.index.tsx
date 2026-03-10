import { Link, createFileRoute } from '@tanstack/react-router'

import { FilteringPatterns } from '#/components/filtering-patterns'

export const Route = createFileRoute('/advanced-filtering/')({
  component: AdvancedFilteringIndexPage,
})

function AdvancedFilteringIndexPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Client-side filtering</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            One payload, all rows in memory, local fuzzy search, faceted counts,
            and immediate predicate composition.
          </p>
          <Link
            from={Route.fullPath}
            to="client"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Open client demo
          </Link>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Server-side filtering</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            URL query state, server filtering, server facets, and fetching only
            the rows needed for the active page.
          </p>
          <Link
            from={Route.fullPath}
            to="server"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Open server demo
          </Link>
        </article>
      </div>

      <FilteringPatterns />
    </div>
  )
}
