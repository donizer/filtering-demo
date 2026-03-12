import { Link, createFileRoute } from '@tanstack/react-router'

import { FilteringPatterns } from '#/components/filtering-patterns'

export const Route = createFileRoute('/advanced-filtering/')({
  component: AdvancedFilteringIndexPage,
})

function AdvancedFilteringIndexPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="island-shell rounded-2xl p-6 md:p-8">
          <p className="island-kicker">Огляд розділу</p>
          <h2 className="display-title mt-2 text-2xl font-semibold md:text-3xl">
            Додавайте фільтрацію поверх уже стабільної табличної основи
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-(--sea-ink-soft)">
            Цей розділ повторно використовує той самий датасет і ту саму
            композицію таблиці, а далі додає фільтрацію, фасети, стан запиту в
            URL і координацію із сервером. Ідея в тому, щоб показати, як фільтри
            нашаровуються на вже зрозумілу структуру замість того, щоб змішувати
            все з нуля.
          </p>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-6">
          <p className="island-kicker">Режими реалізації</p>
          <h3 className="mt-2 text-xl font-semibold">
            Один UI, два різні джерела істини
          </h3>
          <p className="mt-3 text-sm text-(--sea-ink-soft)">
            Клієнтський варіант працює з повним набором рядків у пам’яті.
            Серверний варіант зберігає стан у URL і завантажує лише потрібну
            сторінку результатів. Так легше пояснювати компроміси між обома
            підходами.
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Клієнтська фільтрація</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Один набір даних, усі рядки в пам’яті, локальний fuzzy search,
            фасетні лічильники та миттєва композиція предикатів.
          </p>
          <Link
            from={Route.fullPath}
            to="client"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити клієнтське демо
          </Link>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <h2 className="text-lg font-semibold">Серверна фільтрація</h2>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Стан запиту в URL, серверна фільтрація, серверні фасети та
            завантаження лише тих рядків, які потрібні для активної сторінки.
          </p>
          <Link
            from={Route.fullPath}
            to="server"
            className="mt-4 inline-flex text-sm font-semibold"
          >
            Відкрити серверне демо
          </Link>
        </article>
      </div>

      <FilteringPatterns />
    </div>
  )
}
