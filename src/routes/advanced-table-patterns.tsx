import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const tablePatternItems = [
  {
    to: '/advanced-table-patterns/',
    label: 'Огляд розділу',
    exact: true,
  },
  {
    to: '/advanced-table-patterns/overview',
    label: 'Огляд TanStack Table',
  },
  {
    to: '/advanced-table-patterns/grouped-rows',
    label: 'Згруповані рядки',
  },
  {
    to: '/advanced-table-patterns/responsive',
    label: 'Адаптивний макет',
  },
  {
    to: '/advanced-table-patterns/ui-states',
    label: 'UI-стани',
  },
  {
    to: '/advanced-table-patterns/date-picker',
    label: 'Мобільний вибір дати',
  },
  {
    to: '/advanced-table-patterns/full-example',
    label: 'Повний приклад',
  },
] as const

export const Route = createFileRoute('/advanced-table-patterns')({
  component: AdvancedTablePatternsLayout,
})

function AdvancedTablePatternsLayout() {
  return (
    <SectionLayout
      kicker="Розділ 1"
      title="Просунуті патерни таблиць"
      items={tablePatternItems}
      contentClassName="max-w-none"
    >
      <Outlet />
    </SectionLayout>
  )
}
