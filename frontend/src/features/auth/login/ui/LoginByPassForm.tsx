import { useFormWithRecaptcha } from '@/shared/hooks/useReCaptchaForm'
import {
    LoginByPassFormType,
    loginByPassFormSchema,
} from '../model/login.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginByPassMutation } from '../model/useLoginMutation'
import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootMessage,
    Input,
    PasswordInput,
    LoadingButton,
} from '@/shared/ui'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { telegramService } from '@/shared/lib/telegramService'
import { Checkbox } from '@/shared/ui/checkbox'

export const fields = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Email',
        type: 'email',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Password',
        type: 'password',
    },
] as const

export const LoginByPassForm = () => {
    const router = useRouter()
    const navigate = useNavigate()
    const from = router.state.location.state.from
    const hasTelegram = Boolean(telegramService.initData)
    const form = useFormWithRecaptcha<LoginByPassFormType>({
        formProps: {
            resolver: zodResolver(loginByPassFormSchema),
            defaultValues: {
                email: '',
                password: '',
                linkTelegram: hasTelegram,
            },
        },
        action: 'login',
    })

    const { mutateAsync, isPending } = useLoginByPassMutation()
    const handleError = useFormErrorHandler(form.setError)
    const onSubmit = async (data: WithRecaptcha<LoginByPassFormType>) => {
        await mutateAsync(
            {
                ...data,
                telegramInitData: telegramService.initData,
            },
            {
                onSuccess: () => {
                    navigate({
                        to: from ?? '/',
                        replace: true,
                    })
                },
                onError: handleError,
            },
        )
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <FormRootMessage className="text-center" />
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>

                                <FormControl>
                                    {field.type === 'password' ? (
                                        <PasswordInput
                                            placeholder={field.placeholder}
                                            {...formField}
                                        />
                                    ) : (
                                        <Input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            {...formField}
                                        />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                {hasTelegram && (
                    <FormField
                        control={form.control}
                        name="linkTelegram"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean) =>
                                            field.onChange(Boolean(checked))
                                        }
                                    />
                                </FormControl>

                                <FormLabel className="font-normal">
                                    Привязать Telegram к аккаунту
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                )}
                <LoadingButton
                    loading={isPending}
                    className="w-full"
                    type="submit"
                    disabled={isPending}
                >
                    Войти
                </LoadingButton>
            </form>
        </Form>
    )
}
