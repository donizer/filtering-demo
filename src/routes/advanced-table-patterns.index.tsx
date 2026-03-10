import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/advanced-table-patterns/')({
  component: AdvancedTablePatternsIndexPage,
})

const lessons = [
  {
    title: 'Start from the table core',
    description:
      'Understand column definitions, sorting state, pagination state, and how TanStack Table composes row models.',
    to: '/advanced-table-patterns/overview',
  },
  {
    title: 'Treat mobile as a separate layout problem',
    description:
      'The lecture page shows why prioritised cards and detail views beat horizontal scrolling on narrow screens.',
    to: '/advanced-table-patterns/responsive',
  },
  {
    title: 'Model complex data explicitly',
    description:
      'Grouped rows demonstrate how to move from flat records to expandable structures without mixing in filtering logic.',
    to: '/advanced-table-patterns/grouped-rows',
  },
  {
    title: 'Design state transitions deliberately',
    description:
      'Loading, error, empty, and ready states are first-class table patterns, not afterthoughts.',
    to: '/advanced-table-patterns/ui-states',
  },
  {
    title: 'Keep touch interactions local to row details',
    description:
      'The mobile date picker example stays inside a details/edit flow so it does not turn into filtering-by-date.',
    to: '/advanced-table-patterns/date-picker',
  },
  {
    title: 'Finish with one polished reference',
    description:
      'The full example combines the patterns you will build during the lecture into one screen.',
    to: '/advanced-table-patterns/full-example',
  },
] as const

function AdvancedTablePatternsIndexPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="island-shell rounded-2xl p-6 md:p-8">
          <p className="island-kicker">Learning order</p>
          <h2 className="display-title mt-2 text-2xl font-semibold md:text-3xl">
            Build table skills before introducing filters
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-(--sea-ink-soft)">
            These pages establish the baseline: table mechanics, complex data,
            responsive rendering, mobile interaction, and UI-state design. The
            filtering section can then reuse the same ideas without explaining
            them from scratch.
          </p>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-6">
          <p className="island-kicker">Constraint</p>
          <h3 className="mt-2 text-xl font-semibold">No filtering here</h3>
          <p className="mt-3 text-sm text-(--sea-ink-soft)">
            This first section intentionally excludes filter controls, faceting,
            and URL query filters. Every example focuses only on data shape,
            table behavior, and presentation decisions.
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.to}
            to={lesson.to}
            className="feature-card rounded-2xl border border-(--line) p-5 no-underline"
          >
            <h3 className="text-lg font-semibold text-(--sea-ink)">
              {lesson.title}
            </h3>
            <p className="mt-2 text-sm text-(--sea-ink-soft)">
              {lesson.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
