import { MultiSelect, MultiSelectProps } from '@/shared/ui'

type Props = MultiSelectProps

export function CategoryMultiSelect({
    placeholder = 'Выберите категории',
    label = 'Категории',
    ...rest
}: Props) {
    return <MultiSelect label={label} placeholder={placeholder} {...rest} />
}
