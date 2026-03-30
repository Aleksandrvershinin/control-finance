import { zodResolver } from '@hookform/resolvers/zod'
import { useFormWithRecaptcha } from '@/shared/hooks/useReCaptchaForm'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { useChangePasswordDialogStore } from './useChangePasswordDialogStore'
import {
    confirmChangePasswordFormSchema,
    ConfirmChangePasswordFormValues,
    requestChangePasswordCodeFormSchema,
    RequestChangePasswordCodeFormValues,
} from './changePassword.types'
import {
    useConfirmChangePasswordMutation,
    useRequestChangePasswordCodeMutation,
} from './useChangePasswordMutation'
import { WithRecaptcha } from '@/shared/types/WithRecaptcha'

export function useChangePasswordForm() {
    const closeDialog = useChangePasswordDialogStore((s) => s.close)
    const { mutateAsync: requestCodeAsync, isPending: isRequestPending } =
        useRequestChangePasswordCodeMutation()
    const { mutateAsync: confirmAsync, isPending: isConfirmPending } =
        useConfirmChangePasswordMutation()

    const requestForm = useFormWithRecaptcha<RequestChangePasswordCodeFormValues>(
        {
            formProps: {
                resolver: zodResolver(requestChangePasswordCodeFormSchema),
                defaultValues: {},
            },
            action: 'changePasswordCodeRequest',
        },
    )

    const confirmForm = useFormWithRecaptcha<ConfirmChangePasswordFormValues>({
        formProps: {
            resolver: zodResolver(confirmChangePasswordFormSchema),
            defaultValues: {
                code: '',
                newPassword: '',
                confirmPassword: '',
            },
        },
        action: 'changePasswordConfirm',
    })

    const handleRequestError = useFormErrorHandler(requestForm.setError)
    const handleConfirmError = useFormErrorHandler(confirmForm.setError)

    const requestCode = async (
        data: WithRecaptcha<RequestChangePasswordCodeFormValues>,
    ) => {
        await requestCodeAsync(data, {
            onError: handleRequestError,
        })
    }

    const confirmChangePassword = async (
        data: WithRecaptcha<ConfirmChangePasswordFormValues>,
    ) => {
        await confirmAsync(data, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Пароль успешно изменён',
                })
                requestForm.reset({})
                confirmForm.reset({
                    code: '',
                    newPassword: '',
                    confirmPassword: '',
                })
                closeDialog()
            },
            onError: handleConfirmError,
        })
    }

    return {
        requestForm,
        confirmForm,
        requestCode,
        confirmChangePassword,
        isRequestPending,
        isConfirmPending,
    }
}
