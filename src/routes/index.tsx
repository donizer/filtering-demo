import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="rise-in space-y-6">
      <div className="island-shell rounded-2xl p-6 md:p-8">
        <p className="island-kicker">Навчальний репозиторій TanStack Table</p>
        <h1 className="display-title mt-2 text-3xl font-semibold tracking-tight text-(--sea-ink) md:text-4xl">
          Спочатку складні дані, потім просунута фільтрація
        </h1>
        <p className="mt-3 max-w-3xl text-(--sea-ink-soft)">
          Репозиторій складається з двох навчальних блоків. Спочатку йдуть
          приклади для складних даних, адаптивних таблиць, липких заголовків і
          UI-станів таблиці. Після цього окремим розділом ідуть патерни
          клієнтської та серверної фільтрації.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Просунуті патерни таблиць</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Кілька окремих сторінок для основ TanStack Table, згрупованих
            рядків, адаптивних мобільних макетів, липких заголовків, UI-станів і
            сценарію вибору дати на мобільних пристроях.
          </p>
          <Link
            to="/advanced-table-patterns"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити перший розділ
          </Link>
        </article>

        <article className="feature-card rounded-xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Просунута фільтрація</h2>

          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Окремий розділ із двома демо: клієнтська фільтрація та URL-керована
            серверна фільтрація поверх того самого датасету.
          </p>

          <Link
            to="/advanced-filtering"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити другий розділ
          </Link>
        </article>
      </div>
    </section>
  )
}
