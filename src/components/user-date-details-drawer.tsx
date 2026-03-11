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
  formatUserCountry,
  formatUserDepartment,
  formatUserJoinedAt,
  formatUserRole,
  formatUserSalary,
  formatUserStatus,
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
          <DrawerTitle>Деталі рядка та планування</DrawerTitle>
          <DrawerDescription>
            У цьому прикладі взаємодія з датою залишається всередині сценарію
            деталей рядка, а не переходить у фільтрацію таблиці.
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
                  {formatUserRole(user.role)} ·{' '}
                  {formatUserDepartment(user.department)}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getUserStatusTone(user.status)}`}
              >
                {formatUserStatus(user.status)}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DetailItem
                label="Країна"
                value={formatUserCountry(user.country)}
              />
              <DetailItem label="Вік" value={String(user.age)} />
              <DetailItem
                label="Зарплата"
                value={formatUserSalary(user.salary)}
              />
              <DetailItem
                label="Поточна дата"
                value={formatUserJoinedAt(user.joinedAt)}
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-(--line) bg-white/75 p-4">
            <p className="text-sm font-semibold text-(--sea-ink)">
              Мобільно-оптимізований вибір дати
            </p>
            <p className="mt-1 text-sm text-(--sea-ink-soft)">
              На touch-пристроях він відкривається як нижній drawer, а на
              більших екранах лишається вбудованим popover-елементом.
            </p>

            <div className="mt-4">
              <MobileDatePicker
                label="Оберіть наступну дату перегляду"
                value={user.joinedAt}
                onChange={onDateChange}
              />
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Готово</Button>
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
