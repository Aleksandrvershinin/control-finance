import { useEffect, useMemo, useState } from 'react'
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootMessage,
    Input,
    LoadingButton,
    PasswordInput,
} from '@/shared/ui'
import { useChangePasswordForm } from '../model/useChangePasswordForm'

const RESEND_TIMEOUT_SECONDS = 120
const CHANGE_PASSWORD_STORAGE_KEY = 'changePasswordState'

const formatSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const ChangePasswordForm = () => {
    const restoredState = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                codeRequested: false,
                resendAvailableAt: null as number | null,
            }
        }

        const raw = window.localStorage.getItem(CHANGE_PASSWORD_STORAGE_KEY)
        if (!raw) {
            return {
                codeRequested: false,
                resendAvailableAt: null as number | null,
            }
        }

        try {
            const parsed = JSON.parse(raw) as {
                codeRequested?: unknown
                resendAvailableAt?: unknown
            }
            const codeRequested = parsed.codeRequested === true
            const resendAvailableAt =
                typeof parsed.resendAvailableAt === 'number'
                    ? parsed.resendAvailableAt
                    : null

            if (!codeRequested) {
                return {
                    codeRequested: false,
                    resendAvailableAt: null as number | null,
                }
            }

            if (!resendAvailableAt || resendAvailableAt <= Date.now()) {
                return {
                    codeRequested: true,
                    resendAvailableAt: null as number | null,
                }
            }

            return {
                codeRequested: true,
                resendAvailableAt,
            }
        } catch {
            return {
                codeRequested: false,
                resendAvailableAt: null as number | null,
            }
        }
    }, [])

    const {
        requestForm,
        confirmForm,
        requestCode,
        confirmChangePassword,
        isRequestPending,
        isConfirmPending,
    } = useChangePasswordForm()
    const [codeRequested, setCodeRequested] = useState(
        restoredState.codeRequested,
    )
    const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
        restoredState.resendAvailableAt,
    )
    const [resendTimer, setResendTimer] = useState(0)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (!codeRequested) {
            window.localStorage.removeItem(CHANGE_PASSWORD_STORAGE_KEY)
            return
        }

        window.localStorage.setItem(
            CHANGE_PASSWORD_STORAGE_KEY,
            JSON.stringify({
                codeRequested,
                resendAvailableAt,
            }),
        )
    }, [codeRequested, resendAvailableAt])

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

    const handleRequestCode = async () => {
        await requestForm.handleSubmit(async (data) => {
            await requestCode(data)
            setCodeRequested(true)
            setResendAvailableAt(Date.now() + RESEND_TIMEOUT_SECONDS * 1000)
        })()
    }

    const handleConfirm = confirmForm.handleSubmit(async (data) => {
        try {
            await confirmChangePassword(data)
            setCodeRequested(false)
            setResendAvailableAt(null)
            setResendTimer(0)
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(CHANGE_PASSWORD_STORAGE_KEY)
            }
        } catch {
            // Ошибки уже обработаны в useChangePasswordForm через form errors.
        }
    })

    if (!codeRequested) {
        return (
            <Form {...requestForm}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        void handleRequestCode()
                    }}
                    className="space-y-4 w-full"
                >
                    <FormRootMessage className="text-center" />
                    <p className="text-sm text-muted-foreground text-center">
                        Мы отправим код подтверждения на ваш email.
                    </p>

                    <LoadingButton
                        loading={isRequestPending}
                        className="w-full"
                        type="submit"
                        disabled={isRequestPending}
                    >
                        Получить код
                    </LoadingButton>
                </form>
            </Form>
        )
    }

    return (
        <Form {...confirmForm}>
            <form onSubmit={handleConfirm} className="space-y-4 w-full">
                <FormRootMessage className="text-center" />
                <p className="text-sm text-muted-foreground text-center">
                    Код отправлен на ваш email
                </p>

                <FormField
                    control={confirmForm.control}
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

                <FormField
                    control={confirmForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Новый пароль</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    autoComplete="new-password"
                                    placeholder="Новый пароль"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={confirmForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Повтор нового пароля</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    autoComplete="new-password"
                                    placeholder="Повтор нового пароля"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton
                    loading={isConfirmPending}
                    className="w-full"
                    type="submit"
                    disabled={isConfirmPending}
                >
                    Сохранить пароль
                </LoadingButton>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        void handleRequestCode()
                    }}
                    disabled={resendTimer > 0 || isRequestPending}
                >
                    {isRequestPending
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
                        setCodeRequested(false)
                        setResendAvailableAt(null)
                        setResendTimer(0)
                        confirmForm.reset({
                            code: '',
                            newPassword: '',
                            confirmPassword: '',
                        })
                    }}
                >
                    Запросить код позже
                </Button>
            </form>
        </Form>
    )
}
