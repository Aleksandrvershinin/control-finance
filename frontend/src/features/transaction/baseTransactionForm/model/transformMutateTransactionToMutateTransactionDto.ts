import { formatDateToIso } from '@/shared/lib/utils/formatDateToIso'
import { BaseTransactionFormValues } from './baseTransactionFormSchema'

export const transformMutateTransactionToMutateTransactionDto = <
    T extends BaseTransactionFormValues,
>(
    mutateTransactionData: T,
): Record<string, any> => {
    const entries = Object.entries(mutateTransactionData)
        .map(([key, value]) => {
            // Если это дата, прогоняем через хелпер. Он вернет строку или undefined
            if (key === 'date') {
                return [key, formatDateToIso(value)]
            }
            return [key, value]
        })
        // Фильтруем: убираем пустые строки И любые значения undefined (включая битые даты)
        .filter(([_, value]) => value !== '' && value !== undefined)

    return Object.fromEntries(entries)
}
