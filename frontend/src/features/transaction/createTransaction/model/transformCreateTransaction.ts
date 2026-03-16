import { CreateTransactionDto } from '@/entities/transaction'
import { CreateTransactionFormValues } from './createTransactionForm.types'

export const transformCreateTransactionToCreateTransactionDto = (
    createTransaction: CreateTransactionFormValues,
): CreateTransactionDto => {
    const entries = Object.entries(createTransaction)
        .filter(([_, value]) => value !== '') // фильтруем пустые строки
        .map(([key, value]) => {
            // если поле с датой, преобразуем в ISO-8601
            if (key === 'date' && typeof value === 'string') {
                return [key, new Date(value).toISOString()]
            }
            return [key, value]
        })

    return Object.fromEntries(entries) as CreateTransactionDto
}
