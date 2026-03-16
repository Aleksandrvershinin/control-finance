import { useCreateAccountDialogStore } from './useCreateAccountDialogStore'
import { useCreateAccountMutation } from './useCreateAccountMutation'
import { accountDefaultsValues } from '../../baseAccountForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import {
    createAccountFormSchema,
    CreateAccountFormValues,
} from './createAccount.types'

export function useCreateAccountForm() {
    const closeDialog = useCreateAccountDialogStore((s) => s.close)
    const { mutateAsync } = useCreateAccountMutation()

    const form = useForm<CreateAccountFormValues>({
        resolver: zodResolver(createAccountFormSchema),
        defaultValues: accountDefaultsValues,
    })

    const handleError = useFormErrorHandler(form.setError)
    const onSubmit = async (formData: CreateAccountFormValues) => {
        await mutateAsync(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Счет успешно создан',
                })
                closeDialog()
            },
            onError: handleError,
        })
    }

    return {
        ...form,
        onSubmit,
    }
}
