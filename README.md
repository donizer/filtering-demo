# Filtering Demo Course Repo

This repository is now structured as a two-part lecture app:

1. `Advanced Table Patterns`
2. `Advanced Filtering`

The first section teaches how to work with complex data and TanStack Table without introducing filters. The second section reuses the same dataset and table foundation, then layers on client-side and server-side filtering patterns.

## Getting Started

```bash
pnpm install
pnpm dev
```

`pnpm dev` regenerates `src/data/db.json` with Faker before starting Vite, so the app always boots with a fresh dataset that includes text, categorical, numeric, and date fields.

## App Structure

### Section 1: Advanced Table Patterns

Routes in this section:

- `/advanced-table-patterns/overview` — TanStack Table overview with sorting and pagination
- `/advanced-table-patterns/grouped-rows` — grouped rows and expandable complex data
- `/advanced-table-patterns/responsive` — mobile layout without horizontal scrolling
- `/advanced-table-patterns/ui-states` — loading, empty, error, and ready states
- `/advanced-table-patterns/date-picker` — mobile-optimized date picker inside a row details flow
- `/advanced-table-patterns/full-example` — combined non-filtering reference example

Design rule for this section:

- No filtering controls
- No faceting
- No URL-driven filter state

### Section 2: Advanced Filtering

Routes in this section:

- `/advanced-filtering/client` — one fetch, local predicates, fuzzy search, faceted counts
- `/advanced-filtering/server` — URL-driven filter state, server pagination, server sorting, server facets

Filtering patterns shown in the second section:

- Exact match
- Range / boundaries
- Inclusion / multi-select
- Partial substring search
- Fuzzy search
- Faceted filtering
- Composite filtering

## Shared Data Model

The app reuses one primary user dataset across both sections.

Core fields:

- `id`
- `name`
- `role`
- `department`
- `country`
- `age`
- `salary`
- `joinedAt`
- `status`

Relevant source files:

- `src/data/user-model.ts` — schema, enums, and types
- `src/data/db-utils.ts` — DB loading and paginated querying
- `src/data/user-demo-server.ts` — server functions shared by the lecture pages
- `src/components/user-table-columns.tsx` — shared table columns and formatters

## Development Notes

- Global app shell lives in `src/routes/__root.tsx`.
- Section layouts live in `src/routes/advanced-table-patterns.tsx` and `src/routes/advanced-filtering.tsx`.
- Filtering logic stays isolated in `src/data/user-filters.ts` and `src/components/user-filters-panel.tsx`.
- The mobile date picker is implemented in `src/components/mobile-date-picker.tsx` and reused in a row-details drawer.

## Build, Lint, Test

```bash
pnpm build
pnpm lint
pnpm test
```

Available formatting helpers:

```bash
pnpm format
pnpm check
```

## Styling

The project uses Tailwind CSS plus the local UI component layer in `src/components/ui/`.

The app intentionally uses different presentation strategies for large and small screens:

- dense tables on large screens
- prioritised cards and details flows on smaller screens

This is especially important for the `Advanced Table Patterns` section, where the mobile examples are meant to avoid horizontal scrolling.
