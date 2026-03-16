import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useEffect, useState } from 'react'

import { useMainFilterStore } from '@/features/mainFilter'
import {
    Button,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from '@/shared/ui'
import { Calendar } from '@/shared/ui/calendar'

function toApiDate(date?: Date) {
    return date ? format(date, 'yyyy-MM-dd') : undefined
}

export function DateRangeFilter() {
    const { filters, setFilter } = useMainFilterStore()

    const [range, setRange] = useState<DateRange | undefined>()

    // sync store -> component
    useEffect(() => {
        setRange({
            from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
            to: filters.dateTo ? new Date(filters.dateTo) : undefined,
        })
    }, [filters.dateFrom, filters.dateTo])

    const applyRange = (range?: DateRange) => {
        setRange(range)

        setFilter('dateFrom', toApiDate(range?.from))
        setFilter('dateTo', toApiDate(range?.to))
    }

    const setPreset = (type: 'today' | 'week' | 'month' | 'year') => {
        const now = new Date()

        let from: Date
        let to: Date

        if (type === 'today') {
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            to = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        } else if (type === 'week') {
            from = new Date()
            from.setDate(now.getDate() - 7)
            to = now
        } else if (type === 'month') {
            from = new Date(now.getFullYear(), now.getMonth(), 1)
            to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        } else {
            from = new Date(now.getFullYear(), 0, 1)
            to = new Date(now.getFullYear(), 11, 31)
        }

        applyRange({ from, to })
    }

    return (
        <Stack direction="column" spacing={2}>
            <Label>Диапазон дат</Label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="selectTriger"
                        className="justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {range?.from ? (
                            range.to ? (
                                <>
                                    {format(range.from, 'dd.MM.yyyy')} —{' '}
                                    {format(range.to, 'dd.MM.yyyy')}
                                </>
                            ) : (
                                format(range.from, 'dd.MM.yyyy')
                            )
                        ) : (
                            'Выберите диапазон'
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 flex flex-wrap gap-2 border-b">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreset('today')}
                        >
                            Сегодня
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreset('week')}
                        >
                            7 дней
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreset('month')}
                        >
                            Месяц
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreset('year')}
                        >
                            Год
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyRange(undefined)}
                        >
                            Очистить
                        </Button>
                    </div>

                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={applyRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </Stack>
    )
}
