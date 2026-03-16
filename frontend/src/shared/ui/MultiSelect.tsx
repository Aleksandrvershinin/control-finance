import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from './badge'
import { Button } from './button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Label } from './label'

type Option = {
    label: string
    value: string
}

export interface MultiSelectProps {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    searchable?: string
    label?: React.ReactNode | string
    isClearable?: boolean
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select items',
    searchable,
    label,
    isClearable = true,
}: MultiSelectProps & { label?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)

    const toggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val))
        } else {
            onChange([...value, val])
        }
    }

    const remove = (val: string) => {
        onChange(value.filter((v) => v !== val))
    }

    return (
        <div className="space-y-2">
            {label && (
                <>
                    {typeof label === 'string' ? (
                        <Label>{label}</Label>
                    ) : (
                        <>{label}</>
                    )}
                </>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="selectTriger"
                        role="combobox"
                        className={cn(
                            'w-full justify-between h-auto min-h-11',
                            open && 'ring-2 ring-[--primary-500]',
                        )}
                    >
                        <div className="flex gap-1 flex-wrap">
                            {value.length === 0 && (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}

                            {value.map((val) => {
                                const option = options.find(
                                    (o) => o.value === val,
                                )

                                return (
                                    <Badge key={val} variant="outline">
                                        {option?.label}
                                        <div
                                            className="ml-1 h-4 w-4 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                                            onPointerUp={(e) => {
                                                e.stopPropagation()
                                                remove(val)
                                            }}
                                        >
                                            <X />
                                        </div>
                                    </Badge>
                                )
                            })}
                        </div>
                        {isClearable && value.length > 0 && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange([])
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="ml-auto flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </div>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        {searchable && <CommandInput placeholder="поиск..." />}

                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => toggle(option.value)}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4 ml-auto',
                                            value.includes(option.value)
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
