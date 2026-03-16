import { Account } from '@/entities/account'
import { useUpdateAccountDialogStore } from './useUpdateAccountDialogStore'
import { useUpdateAccountMutation } from './useUpdateAccountMutation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import {
    updateAccountFormSchema,
    UpdateAccountFormValues,
} from './updateAccount.types'

export function useUpdateAccountForm(account: Account) {
    const closeDialog = useUpdateAccountDialogStore((s) => s.close)
    const { mutateAsync } = useUpdateAccountMutation()

    const form = useForm<UpdateAccountFormValues>({
        resolver: zodResolver(updateAccountFormSchema),
        defaultValues: {
            name: account.name,
            order: account.order,
        },
    })

    const handleError = useFormErrorHandler(form.setError)
    const onSubmit = async (formData: UpdateAccountFormValues) => {
        await mutateAsync(
            { id: account.id, data: formData },
            {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Счет успешно обновлен',
                    })
                    closeDialog()
                },
                onError: handleError,
            },
        )
    }

    return {
        ...form,
        onSubmit,
    }
}
