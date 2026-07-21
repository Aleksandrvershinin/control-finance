import { CreateTransactionDto } from '@/entities/transaction'
import {
    CreateIncomeExpenseFormValues,
    CreateTransferFormValues,
    CreateTransferFundFormValues,
} from './shema'
import { formatDateToIso } from '@/shared/lib/utils/formatDateToIso'

export const transformCreateTransactionToCreateTransactionDto = (
    createTransaction:
        | CreateIncomeExpenseFormValues
        | CreateTransferFormValues
        | CreateTransferFundFormValues,
): CreateTransactionDto => {
    const entries = Object.entries(createTransaction)
        .map(([key, value]) => {
            if (key === 'date' && typeof value === 'string') {
                return [key, formatDateToIso(value)]
            }
            return [key, value]
        })
        // Фильтруем пустые строки, undefined и null
        .filter(
            ([_, value]) =>
                value !== '' && value !== undefined && value !== null,
        )

    return Object.fromEntries(entries) as CreateTransactionDto
}
