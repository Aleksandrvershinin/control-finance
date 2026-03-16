import { Transaction } from '@/entities/transaction'
import { useUpdateTransactionDialogStore } from './useUpdateTransactionDialogStore'
import { useUpdateTransactionMutation } from './useUpdateTransactionMutation'
import {
    updateTransactionFormSchema,
    UpdateTransactionFormValues,
} from './updateTransactionForm.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'

export function useUpdateTransactionForm(transaction: Transaction) {
    const close = useUpdateTransactionDialogStore((s) => s.close)
    const { mutateAsync } = useUpdateTransactionMutation()

    const defaultValues: UpdateTransactionFormValues = {
        amount: transaction.amount,
        date: transaction.date.split('T')[0],
        description: transaction.description ?? '',
    }

    const form = useForm<UpdateTransactionFormValues>({
        resolver: zodResolver(updateTransactionFormSchema),
        defaultValues,
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: UpdateTransactionFormValues) => {
        await mutateAsync(
            {
                id: transaction.id,
                data: formData,
            },
            {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Успешно',
                    })
                    close()
                },
                onError: handleError,
            },
        )
    }

    return { ...form, onSubmit }
}
