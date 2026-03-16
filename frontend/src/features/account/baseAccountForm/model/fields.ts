import { DefaultValues } from 'react-hook-form'
import { AccountFormValues } from './account.types'

export type FieldConfig<T> = {
    name: keyof T
    label: string
    type: 'text' | 'number'
}

export const accountFields: FieldConfig<AccountFormValues>[] = [
    { name: 'name', label: 'Название счета', type: 'text' },
    { name: 'order', label: 'Сортировка', type: 'number' },
]

export const accountDefaultsValues: DefaultValues<AccountFormValues> = {
    name: '',
    order: 0,
}
