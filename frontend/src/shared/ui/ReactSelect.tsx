import Select from 'react-select'

type Option = {
    value: string
    label: string
}

export interface ReactSelectProps {
    value?: string
    onChange: (value: string | undefined) => void
    options: Option[]
    placeholder?: string
}

export function ReactSelect({
    value,
    onChange,
    options,
    placeholder,
}: ReactSelectProps) {
    const selected = options.find((o) => o.value === value) ?? null

    return (
        <Select
            options={options}
            value={selected}
            placeholder={placeholder}
            isClearable
            onChange={(option) => onChange(option?.value)}
            classNames={{
                control: () =>
                    'flex h-9 w-full rounded-md border border-input bg-transparent text-sm',
                menu: () => 'border rounded-md shadow-md bg-popover text-sm',
            }}
        />
    )
}
