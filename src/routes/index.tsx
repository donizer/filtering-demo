import { Link, createFileRoute } from '@tanstack/react-router'

import { FilteringPatterns } from '#/components/filtering-patterns'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="rise-in space-y-6">
      <div className="island-shell rounded-2xl p-6 md:p-8">
        <p className="island-kicker">TanStack Table Demo</p>
        <h1 className="display-title mt-2 text-3xl font-semibold tracking-tight text-(--sea-ink) md:text-4xl">
          Client-side vs Server-side filtering patterns
        </h1>
        <p className="mt-3 max-w-3xl text-(--sea-ink-soft)">
          Проєкт показує дві стратегії для таблиць: повне завантаження даних на
          клієнт та URL-кероване фільтрування/пагінацію на сервері. Обидва
          режими демонструють exact, range, inclusion, partial, fuzzy, faceted
          та composite filtering.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Client Filtering</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Один запит, усі дані у браузері, локальний fuzzy search, faceted
            counts і миттєве поєднання кількох колонкових предикатів.
          </p>
          <Link to="/client" className="mt-4 inline-flex text-sm font-semibold">
            Open client demo
          </Link>
        </article>

        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Server Filtering</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Стан у URL, багатопольові фільтри, серверні facets і повернення лише
            потрібної сторінки для активного запиту.
          </p>

          <Link to="/server" className="mt-4 inline-flex text-sm font-semibold">
            Open server demo
          </Link>
        </article>
      </div>

      <FilteringPatterns />
    </section>
  )
}
