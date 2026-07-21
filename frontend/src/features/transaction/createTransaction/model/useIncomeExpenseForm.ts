import { zodResolver } from '@hookform/resolvers/zod'
import {
    createIncomeExpenseFormSchema,
    CreateIncomeExpenseFormValues,
} from './shema'
import {
    CreateTransactionConfig,
    useCreateTransactionDialogStore,
} from './useCreateTransactionDialogStore'
import { useCreateTransactionMutation } from './useCreateTransactionMutation'
import { DefaultValues, useForm } from 'react-hook-form'

import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import {
    DEFAULT_TRANSACTION_CATEGORY_ID,
    DEFAULT_TRANSACTION_DATE,
    DEFAULT_TRANSACTION_DESCRIPTION,
    DEFAULT_TRANSACTION_TYPE,
    TRANSACTION_TYPES,
} from '@/entities/transaction'

const getDefaultValues = (
    config: CreateTransactionConfig,
): DefaultValues<CreateIncomeExpenseFormValues> => {
    return {
        type:
            config.type === TRANSACTION_TYPES.EXPENSE ||
            config.type === TRANSACTION_TYPES.INCOME
                ? config.type
                : DEFAULT_TRANSACTION_TYPE,
        accountId: config.accountId,
        date: DEFAULT_TRANSACTION_DATE,
        categoryId: DEFAULT_TRANSACTION_CATEGORY_ID,
        description: DEFAULT_TRANSACTION_DESCRIPTION,
    }
}

export function useIncomeExpenseForm(config: CreateTransactionConfig) {
    const close = useCreateTransactionDialogStore((s) => s.close)
    const { mutateAsync } = useCreateTransactionMutation()

    const form = useForm<CreateIncomeExpenseFormValues>({
        resolver: zodResolver(createIncomeExpenseFormSchema),
        defaultValues: getDefaultValues(config),
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CreateIncomeExpenseFormValues) => {
        await mutateAsync(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Успешно',
                })
                close()
            },
            onError: handleError,
        })
    }

    return { ...form, onSubmit }
}
