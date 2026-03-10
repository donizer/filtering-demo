import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const tablePatternItems = [
  {
    to: '/advanced-table-patterns/',
    label: 'Section overview',
    description: 'Learning path for the non-filtering half of the workshop.',
  },
  {
    to: '/advanced-table-patterns/overview',
    label: 'TanStack Table overview',
    description: 'Baseline sorting, pagination, and column composition.',
  },
  {
    to: '/advanced-table-patterns/grouped-rows',
    label: 'Grouped rows',
    description: 'Model complex data with expandable department groups.',
  },
  {
    to: '/advanced-table-patterns/responsive',
    label: 'Responsive layout',
    description: 'Keep mobile usable without sideways scrolling.',
  },
  {
    to: '/advanced-table-patterns/ui-states',
    label: 'UI states',
    description:
      'Loading, empty, error, and ready states as teaching material.',
  },
  {
    to: '/advanced-table-patterns/date-picker',
    label: 'Mobile date picker',
    description: 'Touch-first row details flow with date editing.',
  },
  {
    to: '/advanced-table-patterns/full-example',
    label: 'Full example',
    description: 'Combined reference implementation for the first lecture.',
  },
] as const

export const Route = createFileRoute('/advanced-table-patterns')({
  component: AdvancedTablePatternsLayout,
})

function AdvancedTablePatternsLayout() {
  return (
    <SectionLayout
      kicker="Section 1"
      title="Advanced Table Patterns"
      description="This section focuses on complex data, table structure, sticky behavior, touch-friendly details flows, and resilient UI states. Filtering starts only in the next section."
      items={tablePatternItems}
    >
      <div className="rise-in">
        <Outlet />
      </div>
    </SectionLayout>
  )
}
