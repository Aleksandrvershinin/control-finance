import { MultiSelect, MultiSelectProps } from '@/shared/ui'

type Props = MultiSelectProps

export function AccountMultiSelect({
    placeholder = 'Выберите счета',
    label = 'Счета',
    ...rest
}: Props) {
    return <MultiSelect label={label} placeholder={placeholder} {...rest} />
}
