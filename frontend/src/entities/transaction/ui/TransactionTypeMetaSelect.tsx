import { MySelect, MySelectProps } from '@/shared/ui'

type Props = MySelectProps

export const TransactionTypeMetaSelect = ({
    placeholder = 'Выберите тип транзакции',
    label = 'Тип транзакции',
    ...rest
}: Props) => {
    return <MySelect label={label} placeholder={placeholder} {...rest} />
}
