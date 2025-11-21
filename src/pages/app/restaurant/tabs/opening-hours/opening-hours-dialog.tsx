import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { WeekDay } from '@/api/manager/restaurants/opening-hours/get-opening-hours'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { weekDayLabels, weekDayOptions } from '.'

const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4)
  const minutes = ((i % 4) * 15).toString().padStart(2, '0')

  return `${hours.toString().padStart(2, '0')}:${minutes}`
})

interface ExistingHour {
  id: string
  weekDay: WeekDay
  openTime: string
  closeTime: string
}

interface OpeningHoursDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDay?: WeekDay
  existingHours: ExistingHour[]
  onAppend: (hour: {
    weekDay: WeekDay
    openTime: string
    closeTime: string
  }) => void
  onRemove: (id: string) => void
}

export function OpeningHoursDialog({
  open,
  onOpenChange,
  selectedDay,
  existingHours,
  onAppend,
  onRemove,
}: OpeningHoursDialogProps) {
  const [currentDay, setCurrentDay] = useState<WeekDay>(selectedDay || 'monday')

  const [openTime, setOpenTime] = useState('00:00')
  const [closeTime, setCloseTime] = useState('00:00')

  useEffect(() => {
    if (selectedDay) {
      setCurrentDay(selectedDay)
    }
  }, [selectedDay])

  const handleAddHour = () => {
    if (openTime >= closeTime) {
      return
    }

    onAppend({
      weekDay: currentDay,
      openTime,
      closeTime,
    })

    setOpenTime('00:00')
    setCloseTime('00:00')
  }

  const dayHours = existingHours.filter((h) => h.weekDay === currentDay)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Gerenciar horários de {weekDayLabels[currentDay]}
          </DialogTitle>

          <DialogDescription>
            Adicione ou remova horários de funcionamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekDay">Dia da semana</Label>
              <Select
                value={currentDay}
                onValueChange={(value) => setCurrentDay(value as WeekDay)}
              >
                <SelectTrigger id="weekDay" className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {weekDayOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {weekDayLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <div className="w-full space-y-2">
                <Label htmlFor="openTime">Abertura</Label>

                <Select value={openTime} onValueChange={setOpenTime}>
                  <SelectTrigger id="openTime" className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="closeTime">Fechamento</Label>

                <Select value={closeTime} onValueChange={setCloseTime}>
                  <SelectTrigger id="closeTime" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddHour}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {dayHours.length > 0 && (
            <div className="space-y-2">
              {dayHours.map((hour) => (
                <div key={hour.id} className="flex items-center gap-2">
                  <div className="flex w-full items-center gap-2">
                    <Input
                      disabled
                      value={hour.openTime}
                      className="disabled:bg-foreground/25!"
                    />

                    <Input
                      readOnly
                      disabled
                      value={hour.closeTime}
                      className="disabled:bg-foreground/25!"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onRemove(hour.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button">Salvar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
