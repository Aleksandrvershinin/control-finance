import { useFormWithRecaptcha } from '@/shared/hooks/useReCaptchaForm'
import { Input, PasswordInput } from '@/shared/ui'
import { registerFormSchema, RegisterFormType } from '../model/register.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterMutation } from '../model/useRegisterMutation'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootMessage,
    LoadingButton,
} from '@/shared/ui'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { CurrencySelectField } from './CurrencySelectField'

export const fields = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Email',
        type: 'email',
        autocomplete: 'email',
    },
    {
        name: 'password',
        label: 'Пароль',
        placeholder: 'Пароль',
        type: 'password',
        autocomplete: 'off',
    },
    {
        name: 'confirmPassword',
        label: 'Повтор пароля',
        placeholder: 'Повтор пароля',
        type: 'password',
        autocomplete: 'off',
    },
] as const

export const RegisterForm = () => {
    const router = useRouter()
    const navigate = useNavigate()
    const from = router.state.location.state.from
    const form = useFormWithRecaptcha<RegisterFormType>({
        formProps: {
            resolver: zodResolver(registerFormSchema),
            defaultValues: {
                confirmPassword: '',
                currencyId: '',
                email: '',
                password: '',
            },
        },
        action: 'register',
    })

    const { mutateAsync, isPending } = useRegisterMutation()
    const handleError = useFormErrorHandler(form.setError)
    const onSubmit = async (data: WithRecaptcha<RegisterFormType>) => {
        await mutateAsync(data, {
            onSuccess: () => {
                navigate({
                    to: from ?? '/',
                    replace: true,
                })
            },
            onError: handleError,
        })
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
                                    <FormControl>
                                        {field.type === 'password' ? (
                                            <PasswordInput
                                                autoComplete={
                                                    field.autocomplete
                                                }
                                                placeholder={field.placeholder}
                                                {...formField}
                                            />
                                        ) : (
                                            <Input
                                                autoComplete={
                                                    field.autocomplete
                                                }
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                {...formField}
                                            />
                                        )}
                                    </FormControl>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <CurrencySelectField />
                <LoadingButton
                    loading={isPending}
                    className="w-full"
                    type="submit"
                    disabled={isPending}
                >
                    Зарегистрироваться
                </LoadingButton>
            </form>
        </Form>
    )
}
