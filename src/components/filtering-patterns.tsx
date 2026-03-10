const patternCards = [
  {
    title: 'Exact Match',
    label: 'ID, status',
    description:
      'Точний збіг для значень, де потрібна строгa рівність без толерантності.',
    example: "users.filter((user) => user.status === 'active')",
  },
  {
    title: 'Range / Boundaries',
    label: 'age, salary, joinedAt',
    description:
      'Діапазони для чисел і дат. У демо це окремі поля min/max та from/to.',
    example:
      'users.filter((user) => user.salary >= 3000 && user.salary <= 6000)',
  },
  {
    title: 'Inclusion / In',
    label: 'roles, departments, countries',
    description:
      'Коли можна вибрати кілька значень. Усередині групи працює OR через includes().',
    example:
      "users.filter((user) => ['Developer', 'DevOps'].includes(user.role))",
  },
  {
    title: 'Partial Match',
    label: 'name contains',
    description:
      'Класичний contains-пошук для текстового поля, привʼязаного до конкретної колонки.',
    example:
      'users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))',
  },
  {
    title: 'Fuzzy Search',
    label: 'global search',
    description:
      'Глобальний fuzzy search побудований через match-sorter для неточних текстових збігів.',
    example:
      "matchSorter(users, search, { keys: ['name', 'role', 'country'] })",
  },
  {
    title: 'Faceted Filtering',
    label: 'option counts',
    description:
      'Кожна група фільтрів показує кількість доступних значень у поточному контексті інших фільтрів.',
    example:
      "const roleOptions = getFacetedUniqueValues?.() ?? countValues(filteredUsers, 'role')",
  },
  {
    title: 'Composite Filtering',
    label: 'AND across predicates',
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
        <p className="island-kicker">Filtering Patterns</p>
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
