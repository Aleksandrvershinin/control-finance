import { MultiSelect, MultiSelectProps } from '@/shared/ui'

type Props = MultiSelectProps

export const TransactionTypeMetaMultiSelect = ({
    placeholder = 'Выберите типы транзакций',
    label = 'Типы транзакций',
    ...rest
}: Props) => {
    return <MultiSelect label={label} placeholder={placeholder} {...rest} />
}
