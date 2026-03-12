import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const filteringItems = [
  {
    to: '/advanced-filtering/',
    label: 'Огляд розділу',
    exact: true,
  },
  {
    to: '/advanced-filtering/client',
    label: 'Клієнтська фільтрація',
  },
  {
    to: '/advanced-filtering/server',
    label: 'Серверна фільтрація',
  },
] as const

export const Route = createFileRoute('/advanced-filtering')({
  component: AdvancedFilteringLayout,
})

function AdvancedFilteringLayout() {
  return (
    <SectionLayout
      kicker="Розділ 2"
      title="Просунута фільтрація"
      items={filteringItems}
    >
      <Outlet />
    </SectionLayout>
  )
}
