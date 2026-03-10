import { Button } from '#/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '#/components/ui/drawer'
import { MobileDatePicker } from '#/components/mobile-date-picker'
import {
  formatUserJoinedAt,
  formatUserSalary,
  getUserStatusTone,
} from '#/components/user-table-columns'
import type { UserRecord } from '#/data/user-model'

interface UserDateDetailsDrawerProps {
  user: UserRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDateChange: (value: string) => void
}

export function UserDateDetailsDrawer({
  user,
  open,
  onOpenChange,
  onDateChange,
}: UserDateDetailsDrawerProps) {
  if (!user) {
    return null
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Row details and scheduling</DrawerTitle>
          <DrawerDescription>
            This example keeps date interaction inside the row details flow, not
            in table filtering.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 pb-2">
          <div className="rounded-2xl border border-(--line) bg-white/75 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-(--sea-ink)">
                  {user.name}
                </p>
                <p className="mt-1 text-sm text-(--sea-ink-soft)">
                  {user.role} · {user.department}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${getUserStatusTone(user.status)}`}
              >
                {user.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DetailItem label="Country" value={user.country} />
              <DetailItem label="Age" value={String(user.age)} />
              <DetailItem
                label="Salary"
                value={formatUserSalary(user.salary)}
              />
              <DetailItem
                label="Current date"
                value={formatUserJoinedAt(user.joinedAt)}
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-(--line) bg-white/75 p-4">
            <p className="text-sm font-semibold text-(--sea-ink)">
              Mobile-optimized date picker
            </p>
            <p className="mt-1 text-sm text-(--sea-ink-soft)">
              On touch screens this opens a bottom drawer; on larger screens it
              stays inline as a popover.
            </p>

            <div className="mt-4">
              <MobileDatePicker
                label="Pick a next review date"
                value={user.joinedAt}
                onChange={onDateChange}
              />
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--line) bg-white/75 p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-(--sea-ink-soft)">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-(--sea-ink)">{value}</dd>
    </div>
  )
}
