const patternCards = [
  {
    title: 'Точний збіг',
    label: 'ID, статус',
    description:
      'Точний збіг для значень, де потрібна строгa рівність без толерантності.',
    example: "users.filter((user) => user.status === 'active')",
  },
  {
    title: 'Діапазон / межі',
    label: 'age, salary, joinedAt',
    description:
      'Діапазони для чисел і дат. У демо це окремі поля min/max та from/to.',
    example:
      'users.filter((user) => user.salary >= 3000 && user.salary <= 6000)',
  },
  {
    title: 'Включення / In',
    label: 'ролі, відділи, країни',
    description:
      'Коли можна вибрати кілька значень. Усередині групи працює OR через includes().',
    example:
      "users.filter((user) => ['Developer', 'DevOps'].includes(user.role))",
  },
  {
    title: 'Частковий збіг',
    label: 'ім’я містить',
    description:
      'Класичний contains-пошук для текстового поля, привʼязаного до конкретної колонки.',
    example:
      'users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))',
  },
  {
    title: 'Нечіткий пошук',
    label: 'глобальний пошук',
    description:
      'Глобальний fuzzy search побудований через match-sorter для неточних текстових збігів.',
    example:
      "matchSorter(users, search, { keys: ['name', 'role', 'country'] })",
  },
  {
    title: 'Фасетна фільтрація',
    label: 'лічильники опцій',
    description:
      'Кожна група фільтрів показує кількість доступних значень у поточному контексті інших фільтрів.',
    example:
      "const roleOptions = getFacetedUniqueValues?.() ?? countValues(filteredUsers, 'role')",
  },
  {
    title: 'Композитна фільтрація',
    label: 'AND між предикатами',
    description:
      'Усі активні предикати комбінуються разом: exact + range + inclusion + partial.',
    example:
      'users.filter((user) => matchesId(user) && matchesRange(user) && matchesRole(user))',
  },
] as const

export function FilteringPatterns() {
  return (
    <section className="space-y-4">
      <div className="island-shell rounded-2xl p-6 md:p-8">
        <p className="island-kicker">Патерни фільтрації</p>
        <h2 className="display-title mt-2 text-2xl font-semibold md:text-3xl">
          Патерни, які показує демо
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-(--sea-ink-soft)">
          У клієнтській версії фільтри працюють поверх масиву в браузері. У
          серверній версії той самий набір предикатів застосовується на сервері,
          а стан лежить у URL.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patternCards.map((pattern) => (
          <article
            key={pattern.title}
            className="feature-card rounded-2xl border border-(--line) p-5"
          >
            <p className="island-kicker">{pattern.label}</p>
            <h3 className="mt-2 text-lg font-semibold">{pattern.title}</h3>
            <p className="mt-2 text-sm text-(--sea-ink-soft)">
              {pattern.description}
            </p>
            <pre className="mt-4 bg-border rounded-xl p-4 text-xs leading-6 whitespace-pre-wrap wrap-break-word">
              <code className="wrap-anywhere">{pattern.example}</code>
            </pre>
          </article>
        ))}
      </div>
    </section>
  )
}
