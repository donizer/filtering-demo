import * as React from 'react'
import { CalendarDays } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '#/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { useIsMobile } from '#/hooks/use-mobile'

interface MobileDatePickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function MobileDatePicker({
  label,
  value,
  onChange,
}: MobileDatePickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const selectedDate = parseDateValue(value)

  const trigger = (
    <Button variant="outline" className="w-full justify-between bg-white/80">
      <span>{selectedDate ? formatDateLabel(selectedDate) : label}</span>
      <CalendarDays className="size-4" />
    </Button>
  )

  const calendar = (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => {
        if (!date) {
          return
        }

        onChange(toDateValue(date))
        setOpen(false)
      }}
      className="mx-auto"
    />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{label}</DrawerTitle>
            <DrawerDescription>
              Оберіть дату в тому самому дружньому до touch сценарії, який ви
              використовували б у панелі деталей рядка.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2">{calendar}</div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Закрити
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              Очистити значення
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        {calendar}
        <div className="border-t border-(--line) p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
          >
            Очистити значення
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function parseDateValue(value: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
  }).format(date)
}
