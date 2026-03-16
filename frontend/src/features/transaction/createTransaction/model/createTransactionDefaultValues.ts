import { DefaultValues } from 'react-hook-form'
import { CreateTransactionFormValues } from './createTransactionForm.types'

export const createTransactionDefaultValues: DefaultValues<CreateTransactionFormValues> =
    {
        accountId: '',
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        description: '',
    }
