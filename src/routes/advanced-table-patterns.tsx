import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const tablePatternItems = [
  {
    to: '/advanced-table-patterns/',
    label: 'Огляд розділу',
    description: 'Навчальна траєкторія для частини воркшопу без фільтрації.',
  },
  {
    to: '/advanced-table-patterns/overview',
    label: 'Огляд TanStack Table',
    description: 'Базове сортування, пагінація та композиція колонок.',
  },
  {
    to: '/advanced-table-patterns/grouped-rows',
    label: 'Згруповані рядки',
    description: 'Моделювання складних даних через розгортні групи відділів.',
  },
  {
    to: '/advanced-table-patterns/responsive',
    label: 'Адаптивний макет',
    description: 'Зберегти зручність на мобільних без бокового скролу.',
  },
  {
    to: '/advanced-table-patterns/ui-states',
    label: 'UI-стани',
    description:
      'Стани завантаження, порожнього результату, помилки й готовності як навчальний матеріал.',
  },
  {
    to: '/advanced-table-patterns/date-picker',
    label: 'Мобільний вибір дати',
    description:
      'Сценарій деталей рядка з редагуванням дати, дружній до touch.',
  },
  {
    to: '/advanced-table-patterns/full-example',
    label: 'Повний приклад',
    description: 'Зведена еталонна реалізація для першої лекції.',
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
      description="Цей розділ зосереджений на складних даних, структурі таблиці, липкій поведінці, дружніх до touch деталях рядка та стійких UI-станах. Фільтрація починається лише в наступному розділі."
      items={tablePatternItems}
    >
      <div className="rise-in">
        <Outlet />
      </div>
    </SectionLayout>
  )
}
