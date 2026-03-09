import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'

import type { UserFacets } from '#/data/user-filters'
import type { UserFilters, UserStatusFilter } from '#/data/user-model'

type TextFilterKey =
  | 'global'
  | 'id'
  | 'name'
  | 'ageMin'
  | 'ageMax'
  | 'salaryMin'
  | 'salaryMax'
  | 'joinedFrom'
  | 'joinedTo'

type ArrayFilterKey = 'roles' | 'departments' | 'countries'

interface UserFiltersPanelProps {
  filters: UserFilters
  facets: UserFacets
  activeFilterCount: number
  resultCount: number
  totalCount: number
  modeLabel: string
  isApplyPending?: boolean
  onTextChange: (key: TextFilterKey, value: string) => void
  onStatusChange: (value: UserStatusFilter) => void
  onToggleArrayValue: (key: ArrayFilterKey, value: string) => void
  onReset: () => void
  onApply?: () => void
}

interface FilterChipGroupProps {
  title: string
  description: string
  values: string[]
  options: Array<{ value: string; count: number }>
  onToggle: (value: string) => void
}

function FilterChipGroup({
  title,
  description,
  values,
  options,
  onToggle,
}: FilterChipGroupProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-(--line) bg-white/55 p-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-(--sea-ink-soft)">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = values.includes(option.value)

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              disabled={option.count === 0 && !isSelected}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-(--lagoon-deep) bg-(--lagoon) text-white'
                  : 'border-(--line) bg-white/80 text-(--sea-ink)',
                option.count === 0 &&
                  !isSelected &&
                  'cursor-not-allowed opacity-45',
              )}
            >
              <span>{option.value}</span>
              <span className="rounded-full bg-black/8 px-1.5 py-0.5 text-[11px]">
                {option.count}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function UserFiltersPanel({
  filters,
  facets,
  activeFilterCount,
  resultCount,
  totalCount,
  modeLabel,
  isApplyPending = false,
  onTextChange,
  onStatusChange,
  onToggleArrayValue,
  onReset,
  onApply,
}: UserFiltersPanelProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-(--line) bg-white/45 p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="island-kicker">{modeLabel}</p>
          <h2 className="text-xl font-semibold">Column-by-column filters</h2>
          <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
            Exact match, ranges, inclusion lists, partial text search, fuzzy
            search and faceted counts all work together. Between groups the
            logic is AND; inside each multi-select group the logic is OR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{activeFilterCount} active filters</Badge>
          <Badge variant="outline">
            {resultCount} matched / {totalCount} total
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium">Global fuzzy search</span>
          <Input
            value={filters.global}
            onChange={(event) => onTextChange('global', event.target.value)}
            placeholder="Fuzzy match by name, role, country..."
            className="bg-white/80"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">ID exact match</span>
          <Input
            type="number"
            value={filters.id}
            onChange={(event) => onTextChange('id', event.target.value)}
            placeholder="42"
            className="bg-white/80"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Name contains</span>
          <Input
            value={filters.name}
            onChange={(event) => onTextChange('name', event.target.value)}
            placeholder="Olena"
            className="bg-white/80"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Status</span>
          <Select value={filters.status} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium">Age range</span>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={filters.ageMin}
              onChange={(event) => onTextChange('ageMin', event.target.value)}
              placeholder="Min"
              className="bg-white/80"
            />
            <Input
              type="number"
              value={filters.ageMax}
              onChange={(event) => onTextChange('ageMax', event.target.value)}
              placeholder="Max"
              className="bg-white/80"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Salary range</span>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={filters.salaryMin}
              onChange={(event) =>
                onTextChange('salaryMin', event.target.value)
              }
              placeholder="Min"
              className="bg-white/80"
            />
            <Input
              type="number"
              value={filters.salaryMax}
              onChange={(event) =>
                onTextChange('salaryMax', event.target.value)
              }
              placeholder="Max"
              className="bg-white/80"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Joined date</span>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.joinedFrom}
              onChange={(event) =>
                onTextChange('joinedFrom', event.target.value)
              }
              className="bg-white/80"
            />
            <Input
              type="date"
              value={filters.joinedTo}
              onChange={(event) => onTextChange('joinedTo', event.target.value)}
              className="bg-white/80"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <FilterChipGroup
          title="Role inclusion"
          description="Multi-select inclusion filter with faceted counts."
          values={filters.roles}
          options={facets.roles}
          onToggle={(value) => onToggleArrayValue('roles', value)}
        />

        <FilterChipGroup
          title="Department inclusion"
          description="Selecting one department narrows the available values in others."
          values={filters.departments}
          options={facets.departments}
          onToggle={(value) => onToggleArrayValue('departments', value)}
        />

        <FilterChipGroup
          title="Country inclusion"
          description="Faceted counts reflect the current context of the composite query."
          values={filters.countries}
          options={facets.countries}
          onToggle={(value) => onToggleArrayValue('countries', value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--line) pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-(--sea-ink-soft)">
          {facets.statuses.map((status) => (
            <Badge key={status.value} variant="outline">
              {status.value}: {status.count}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onReset}>
            Reset filters
          </Button>
          {onApply ? (
            <Button
              variant={isApplyPending ? 'default' : 'ghost'}
              disabled={!isApplyPending}
              onClick={onApply}
            >
              Apply filters
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
