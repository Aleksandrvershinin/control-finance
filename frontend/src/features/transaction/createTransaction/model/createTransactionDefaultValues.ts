import { DefaultValues } from 'react-hook-form'
import { CreateIncomeExpenseFormValues } from './shema'

export const createTransactionDefaultValues: DefaultValues<CreateIncomeExpenseFormValues> =
    {
        accountId: '',
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        description: '',
    }
