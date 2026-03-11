import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SectionLayout } from '#/components/section-layout'

const filteringItems = [
  {
    to: '/advanced-filtering/',
    label: 'Огляд розділу',
    description:
      'Як фільтрація спирається на табличну основу з першого розділу.',
  },
  {
    to: '/advanced-filtering/client',
    label: 'Клієнтська фільтрація',
    description:
      'Усі рядки в пам’яті, локальні предикати та фасетні лічильники.',
  },
  {
    to: '/advanced-filtering/server',
    label: 'Серверна фільтрація',
    description: 'Стан фільтрів у URL із серверною пагінацією та сортуванням.',
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
      description="Цей розділ повторно використовує той самий датасет і ту саму композицію таблиці, а далі додає фільтрацію, фасети, стан запиту в URL і координацію із сервером."
      items={filteringItems}
    >
      <div className="rise-in">
        <Outlet />
      </div>
    </SectionLayout>
  )
}
