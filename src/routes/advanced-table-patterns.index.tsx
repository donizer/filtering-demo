import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/advanced-table-patterns/')({
  component: AdvancedTablePatternsIndexPage,
})

const lessons = [
  {
    title: 'Почніть з ядра таблиці',
    description:
      'Розберіться з визначеннями колонок, станом сортування, станом пагінації та тим, як TanStack Table складає row models.',
    to: '/advanced-table-patterns/overview',
  },
  {
    title: 'Сприймайте мобільний режим як окрему задачу макета',
    description:
      'Ця сторінка показує, чому пріоритизовані картки та детальні перегляди кращі за горизонтальний скрол на вузьких екранах.',
    to: '/advanced-table-patterns/responsive',
  },
  {
    title: 'Моделюйте складні дані явно',
    description:
      'Згруповані рядки демонструють, як перейти від плоских записів до розгортних структур без змішування з логікою фільтрації.',
    to: '/advanced-table-patterns/grouped-rows',
  },
  {
    title: 'Проєктуйте переходи між станами свідомо',
    description:
      'Стани завантаження, помилки, порожнього результату й готовності є повноцінними патернами таблиць, а не побічною думкою.',
    to: '/advanced-table-patterns/ui-states',
  },
  {
    title: 'Локалізуйте touch-взаємодії в деталях рядка',
    description:
      'Приклад мобільного вибору дати лишається всередині сценарію деталей і редагування, щоб не перетворюватися на фільтрацію за датою.',
    to: '/advanced-table-patterns/date-picker',
  },
  {
    title: 'Завершіть одним цілісним еталоном',
    description:
      'Повний приклад об’єднує патерни, які ви будете будувати під час лекції, в один екран.',
    to: '/advanced-table-patterns/full-example',
  },
] as const

function AdvancedTablePatternsIndexPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="island-shell rounded-2xl p-6 md:p-8">
          <p className="island-kicker">Порядок навчання</p>
          <h2 className="display-title mt-2 text-2xl font-semibold md:text-3xl">
            Спочатку зберіть навички роботи з таблицями, а вже потім додавайте
            фільтри
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-(--sea-ink-soft)">
            Ці сторінки задають базу: механіка таблиці, складні дані, адаптивний
            рендеринг, мобільна взаємодія та проєктування UI-станів. Після цього
            розділ про фільтрацію може повторно використовувати ті самі ідеї без
            пояснення з нуля.
          </p>
        </article>

        <article className="feature-card rounded-2xl border border-(--line) p-6">
          <p className="island-kicker">Обмеження</p>
          <h3 className="mt-2 text-xl font-semibold">Тут немає фільтрації</h3>
          <p className="mt-3 text-sm text-(--sea-ink-soft)">
            Перший розділ навмисно не містить контролів фільтрації, фасетів і
            URL-фільтрів. Кожен приклад зосереджується лише на формі даних,
            поведінці таблиці та рішеннях подання.
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
