import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormWithRecaptcha } from '@/shared/hooks/useReCaptchaForm'
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
    Input,
    LoadingButton,
    Button,
} from '@/shared/ui'
import {
    confirmLoginCodeFormSchema,
    ConfirmLoginCodeFormType,
    requestLoginCodeFormSchema,
    RequestLoginCodeFormType,
} from '../model/login.types'
import {
    useLoginByCodeMutation,
    useRequestLoginCodeMutation,
} from '../model/useLoginMutation'

const RESEND_TIMEOUT_SECONDS = 120
const LOGIN_BY_CODE_STORAGE_KEY = 'loginByCodeState'

const formatSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const LoginByCodeForm = () => {
    const restoredState = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                email: null as string | null,
                resendAvailableAt: null as number | null,
            }
        }

        const raw = window.localStorage.getItem(LOGIN_BY_CODE_STORAGE_KEY)
        if (!raw) {
            return {
                email: null as string | null,
                resendAvailableAt: null as number | null,
            }
        }

        try {
            const parsed = JSON.parse(raw) as {
                email?: unknown
                resendAvailableAt?: unknown
            }
            const email = typeof parsed.email === 'string' ? parsed.email : null
            const resendAvailableAt =
                typeof parsed.resendAvailableAt === 'number'
                    ? parsed.resendAvailableAt
                    : null

            if (!email) {
                return {
                    email: null as string | null,
                    resendAvailableAt: null as number | null,
                }
            }

            if (!resendAvailableAt || resendAvailableAt <= Date.now()) {
                return { email, resendAvailableAt: null as number | null }
            }

            return { email, resendAvailableAt }
        } catch {
            return {
                email: null as string | null,
                resendAvailableAt: null as number | null,
            }
        }
    }, [])

    const router = useRouter()
    const navigate = useNavigate()
    const { executeRecaptcha } = useGoogleReCaptcha()
    const from = router.state.location.state.from
    const [requestedEmail, setRequestedEmail] = useState<string | null>(
        restoredState.email,
    )
    const [resendTimer, setResendTimer] = useState(0)
    const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
        restoredState.resendAvailableAt,
    )

    const requestForm = useFormWithRecaptcha<RequestLoginCodeFormType>({
        formProps: {
            resolver: zodResolver(requestLoginCodeFormSchema),
            defaultValues: {
                email: restoredState.email ?? '',
            },
        },
        action: 'loginCodeRequest',
    })

    const codeForm = useFormWithRecaptcha<ConfirmLoginCodeFormType>({
        formProps: {
            resolver: zodResolver(confirmLoginCodeFormSchema),
            defaultValues: {
                email: restoredState.email ?? '',
                code: '',
            },
        },
        action: 'loginCodeConfirm',
    })

    const requestCodeMutation = useRequestLoginCodeMutation()
    const loginByCodeMutation = useLoginByCodeMutation()
    const handleRequestError = useFormErrorHandler(requestForm.setError)
    const handleCodeError = useFormErrorHandler(codeForm.setError)

    useEffect(() => {
        if (!resendAvailableAt) {
            setResendTimer(0)
            return
        }

        const updateTimer = () => {
            const secondsLeft = Math.max(
                Math.ceil((resendAvailableAt - Date.now()) / 1000),
                0,
            )

            setResendTimer(secondsLeft)

            if (secondsLeft === 0) {
                setResendAvailableAt(null)
            }
        }

        updateTimer()
        const intervalId = setInterval(updateTimer, 1000)

        return () => clearInterval(intervalId)
    }, [resendAvailableAt])

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (!requestedEmail) {
            window.localStorage.removeItem(LOGIN_BY_CODE_STORAGE_KEY)
            return
        }

        window.localStorage.setItem(
            LOGIN_BY_CODE_STORAGE_KEY,
            JSON.stringify({
                email: requestedEmail,
                resendAvailableAt,
            }),
        )
    }, [requestedEmail, resendAvailableAt])

    const onRequestCode = async (
        data: WithRecaptcha<RequestLoginCodeFormType>,
    ) => {
        await requestCodeMutation.mutateAsync(data, {
            onSuccess: () => {
                setRequestedEmail(data.email)
                codeForm.reset({ email: data.email, code: '' })
                setResendAvailableAt(Date.now() + RESEND_TIMEOUT_SECONDS * 1000)
            },
            onError: handleRequestError,
        })
    }

    const onResendCode = async () => {
        if (
            !requestedEmail ||
            resendTimer > 0 ||
            requestCodeMutation.isPending
        ) {
            return
        }

        if (!executeRecaptcha) {
            codeForm.setError('root', {
                type: 'manual',
                message: 'captcha не инициализирована',
            })
            return
        }

        const recaptchaToken = await executeRecaptcha('loginCodeRequest')
        if (!recaptchaToken) {
            codeForm.setError('root', {
                type: 'manual',
                message: 'captcha не пройдена',
            })
            return
        }

        await requestCodeMutation.mutateAsync(
            { email: requestedEmail, recaptchaToken },
            {
                onSuccess: () => {
                    codeForm.setValue('code', '')
                    setResendAvailableAt(
                        Date.now() + RESEND_TIMEOUT_SECONDS * 1000,
                    )
                },
                onError: handleCodeError,
            },
        )
    }

    const onConfirmCode = async (
        data: WithRecaptcha<ConfirmLoginCodeFormType>,
    ) => {
        await loginByCodeMutation.mutateAsync(data, {
            onSuccess: () => {
                navigate({
                    to: from ?? '/',
                    replace: true,
                })
            },
            onError: handleCodeError,
        })
    }

    if (!requestedEmail) {
        return (
            <Form {...requestForm}>
                <form
                    onSubmit={requestForm.handleSubmit(onRequestCode)}
                    className="space-y-4 w-full"
                >
                    <FormRootMessage className="text-center" />
                    <FormField
                        control={requestForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <LoadingButton
                        loading={requestCodeMutation.isPending}
                        className="w-full"
                        type="submit"
                        disabled={requestCodeMutation.isPending}
                    >
                        Получить код
                    </LoadingButton>
                </form>
            </Form>
        )
    }

    return (
        <Form {...codeForm}>
            <form
                onSubmit={codeForm.handleSubmit(onConfirmCode)}
                className="space-y-4 w-full"
            >
                <FormRootMessage className="text-center" />
                <p className="text-sm text-muted-foreground text-center">
                    Код отправлен на {requestedEmail}
                </p>

                <FormField
                    control={codeForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" readOnly {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Код из email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Введите 6-значный код"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton
                    loading={loginByCodeMutation.isPending}
                    className="w-full"
                    type="submit"
                    disabled={loginByCodeMutation.isPending}
                >
                    Войти по коду
                </LoadingButton>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onResendCode}
                    disabled={resendTimer > 0 || requestCodeMutation.isPending}
                >
                    {requestCodeMutation.isPending
                        ? 'Отправка...'
                        : resendTimer > 0
                          ? `Запросить код заново через ${formatSeconds(resendTimer)}`
                          : 'Запросить код заново'}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                        setRequestedEmail(null)
                        setResendTimer(0)
                        setResendAvailableAt(null)
                        requestForm.reset({
                            email: codeForm.getValues('email'),
                        })
                    }}
                >
                    Изменить email
                </Button>
            </form>
        </Form>
    )
}
