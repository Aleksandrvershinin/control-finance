import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import {
    useForm,
    UseFormProps,
    UseFormReturn,
    SubmitHandler,
    FieldValues,
    UseFormHandleSubmit,
} from 'react-hook-form'

export function useFormWithRecaptcha<T extends FieldValues>({
    formProps,
    action = 'submit',
}: {
    formProps?: UseFormProps<T>
    action?: string
}): Omit<UseFormReturn<T>, 'handleSubmit'> & {
    handleSubmit: (
        onValid: SubmitHandler<WithRecaptcha<T>>,
        onInvalid?: Parameters<UseFormHandleSubmit<T>>[1],
    ) => ReturnType<UseFormHandleSubmit<T>>
} {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const methods = useForm<T>(formProps)
    const { handleSubmit, ...rest } = methods

    const handleSubmitWithRecaptcha = (
        onValid: SubmitHandler<WithRecaptcha<T>>,
        onInvalid?: Parameters<typeof handleSubmit>[1],
    ) => {
        return handleSubmit(async (data: T) => {
            if (!executeRecaptcha) {
                methods.setError('root', {
                    type: 'manual',
                    message: 'captcha не инициализирована',
                })
                return
            }
            const recaptchaToken = await executeRecaptcha(action)
            if (!recaptchaToken) {
                methods.setError('root', {
                    type: 'manual',
                    message: 'captcha не пройдена',
                })
                return
            }
            await onValid({
                ...data,
                recaptchaToken,
            })
        }, onInvalid)
    }

    return {
        ...rest,
        handleSubmit: handleSubmitWithRecaptcha,
    }
}
