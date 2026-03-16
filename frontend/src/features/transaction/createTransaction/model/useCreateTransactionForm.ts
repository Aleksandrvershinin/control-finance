import {
    CreateTransactionConfig,
    useCreateTransactionDialogStore,
} from './useCreateTransactionDialogStore'
import { DefaultValues, useForm } from 'react-hook-form'
import { useCreateTransactionMutation } from './useCreateTransactionMutation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { createTransactionDefaultValues } from './createTransactionDefaultValues'
import {
    createTransactionFormSchema,
    CreateTransactionFormValues,
} from './createTransactionForm.types'

const getDefaultValues = (
    config: CreateTransactionConfig,
): DefaultValues<CreateTransactionFormValues> => {
    if (config.type === 'TRANSFER') {
        return {
            type: 'TRANSFER',
            accountId: config.accountId,
            toAccountId: '',
            date: createTransactionDefaultValues.date,
            description: createTransactionDefaultValues.description,
        }
    }

    return {
        type: config.type,
        accountId: config.accountId,
        date: createTransactionDefaultValues.date,
        categoryId: '',
        description: createTransactionDefaultValues.description,
    }
}

export function useCreateTransactionForm(config: CreateTransactionConfig) {
    const close = useCreateTransactionDialogStore((s) => s.close)
    const { mutateAsync } = useCreateTransactionMutation()

    const form = useForm<CreateTransactionFormValues>({
        resolver: zodResolver(createTransactionFormSchema),
        defaultValues: getDefaultValues(config),
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CreateTransactionFormValues) => {
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
