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
          <h2 className="text-lg font-semibold">Клієнтська фільтрація</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Один набір даних, усі рядки в пам’яті, локальний fuzzy search,
            фасетні лічильники та миттєва композиція предикатів.
          </p>
          <Link
            from={Route.fullPath}
            to="client"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити клієнтське демо
          </Link>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Серверна фільтрація</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Стан запиту в URL, серверна фільтрація, серверні фасети та
            завантаження лише тих рядків, які потрібні для активної сторінки.
          </p>
          <Link
            from={Route.fullPath}
            to="server"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити серверне демо
          </Link>
        </article>
      </div>

      <FilteringPatterns />
    </div>
  )
}
