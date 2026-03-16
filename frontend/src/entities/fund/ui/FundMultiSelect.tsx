import { MultiSelect, MultiSelectProps } from '@/shared/ui'

type Props = MultiSelectProps

export const FundMultiSelect = ({
    placeholder = 'Выберите фонды',
    label = 'Фонды',
    ...rest
}: Props) => {
    return <MultiSelect label={label} placeholder={placeholder} {...rest} />
}
