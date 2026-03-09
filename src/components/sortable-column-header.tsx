import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'

interface SortableColumnHeaderProps {
  label: string
  sortDirection: false | 'asc' | 'desc'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function SortableColumnHeader({
  label,
  sortDirection,
  onClick,
}: SortableColumnHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-semibold text-(--sea-ink) transition-colors hover:text-(--lagoon-deep)"
    >
      <span>{label}</span>
      {sortDirection === 'asc' ? (
        <ArrowUpIcon className="size-3.5" />
      ) : sortDirection === 'desc' ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ArrowUpDownIcon className="size-3.5 opacity-60" />
      )}
    </button>
  )
}
