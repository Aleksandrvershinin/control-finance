import { zodResolver } from '@hookform/resolvers/zod'
import {
    createIncomeExpenseFormSchema,
    CreateIncomeExpenseFormValues,
    createTransferFormSchema,
    CreateTransferFormValues,
} from './shema'
import {
    CreateTransactionConfig,
    useCreateTransactionDialogStore,
} from './useCreateTransactionDialogStore'
import { useCreateTransactionMutation } from './useCreateTransactionMutation'
import { DefaultValues, useForm } from 'react-hook-form'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { DEFAULT_TRANSACTION_DATE } from '@/entities/transaction'

const getDefaultValues = (
    config: CreateTransactionConfig,
): DefaultValues<CreateTransferFormValues> => {
    return {
        type: 'TRANSFER',
        accountId: config.accountId,
        date: DEFAULT_TRANSACTION_DATE,
    }
}

export function useTransferForm(config: CreateTransactionConfig) {
    const close = useCreateTransactionDialogStore((s) => s.close)
    const { mutateAsync } = useCreateTransactionMutation()

    const form = useForm<CreateTransferFormValues>({
        resolver: zodResolver(createTransferFormSchema),
        defaultValues: getDefaultValues(config),
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CreateTransferFormValues) => {
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
