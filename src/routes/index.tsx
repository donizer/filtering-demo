import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="rise-in space-y-6">
      <div className="island-shell rounded-2xl p-6 md:p-8">
        <p className="island-kicker">TanStack Table Course Repo</p>
        <h1 className="display-title mt-2 text-3xl font-semibold tracking-tight text-(--sea-ink) md:text-4xl">
          Working with complex data first, advanced filtering second
        </h1>
        <p className="mt-3 max-w-3xl text-(--sea-ink-soft)">
          Репозиторій тепер складається з двох частин. Спочатку йдуть приклади
          для complex data, mobile-friendly tables, sticky headers та table UI
          states. Після цього окремим блоком ідуть client-side та server-side
          filtering patterns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Advanced Table Patterns</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Кілька окремих сторінок для TanStack Table fundamentals, grouped
            rows, responsive mobile layouts, sticky headers, UI states та mobile
            date picker flow.
          </p>
          <Link
            to="/advanced-table-patterns"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Open first section
          </Link>
        </article>

        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Advanced Filtering</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Окремий розділ з двома демо: client-side filtering та URL-кероване
            server-side filtering поверх того ж датасету.
          </p>

          <Link
            to="/advanced-filtering"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Open second section
          </Link>
        </article>
      </div>
    </section>
  )
}
