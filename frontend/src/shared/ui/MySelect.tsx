import {
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui'
import React, { useId } from 'react'

export type MySelectProps = {
    options: Array<{ label: string; value: string }>
    onChange: (value: string) => void
    value?: string
    name?: string
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLButtonElement>
    isClearable?: boolean
    placeholder?: string
    label?: string | React.ReactNode
}

export const MySelect = React.forwardRef<HTMLButtonElement, MySelectProps>(
    (
        {
            value,
            onChange,
            options,
            name,
            disabled,
            onBlur,
            isClearable,
            placeholder,
            label,
        },
        ref,
    ) => {
        const id = useId()

        return (
            <div className="space-y-2">
                {label && (
                    <>
                        {typeof label === 'string' ? (
                            <Label htmlFor={id}>{label}</Label>
                        ) : (
                            <>{label}</>
                        )}
                    </>
                )}

                <Select
                    name={name}
                    disabled={disabled}
                    value={value}
                    onValueChange={onChange}
                >
                    <SelectTrigger
                        ref={ref}
                        id={label ? id : undefined}
                        onBlur={onBlur}
                        isClearable={isClearable}
                        hasValue={!!value}
                        onClear={() => onChange('')}
                    >
                        {placeholder && (
                            <SelectValue placeholder={placeholder} />
                        )}
                    </SelectTrigger>

                    <SelectContent>
                        {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    },
)

MySelect.displayName = 'MySelect'
