import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const filteringItems = [
  {
    to: '/advanced-filtering/',
    label: 'Section overview',
    description:
      'How filtering builds on the table foundations from section one.',
  },
  {
    to: '/advanced-filtering/client',
    label: 'Client filtering',
    description: 'All rows in memory with local predicates and faceted counts.',
  },
  {
    to: '/advanced-filtering/server',
    label: 'Server filtering',
    description: 'URL-driven filter state with server pagination and sorting.',
  },
] as const

export const Route = createFileRoute('/advanced-filtering')({
  component: AdvancedFilteringLayout,
})

function AdvancedFilteringLayout() {
  return (
    <SectionLayout
      kicker="Section 2"
      title="Advanced Filtering"
      description="This section reuses the same dataset and table composition, then layers on filtering, facets, URL query state, and server coordination."
      items={filteringItems}
    >
      <div className="rise-in">
        <Outlet />
      </div>
    </SectionLayout>
  )
}
