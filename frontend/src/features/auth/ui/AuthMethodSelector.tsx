import { PropsWithChildren, useState } from 'react'
import { Button, LoadingButton } from '@/shared/ui'
import { Stack } from '@/shared/ui/Stack'
import { useLoginTelegramMutation } from '../login'
import { telegramService } from '@/shared/lib/telegramService'
import { AlertCircle } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'

interface Props extends PropsWithChildren {}

export const AuthMethodSelector = ({ children }: Props) => {
    const navigate = useNavigate()
    const router = useRouter()
    const from = router.state.location.state.from
    const telegramLogin = useLoginTelegramMutation()

    const initData = telegramService.initData

    const [showEmail, setShowEmail] = useState(!initData)

    if (!initData) {
        return children
    }

    return (
        <>
            {!showEmail ? (
                <Stack direction={'column'} spacing={4}>
                    {telegramLogin.isError && (
                        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Не удалось выполнить вход через Telegram.
                                Попробуйте снова или используйте Email.
                            </span>
                        </div>
                    )}
                    <Stack spacing={4} className="flex-col sm:flex-row">
                        <LoadingButton
                            loading={telegramLogin.isPending}
                            onClick={() =>
                                telegramLogin.mutate(
                                    {
                                        initData,
                                    },
                                    {
                                        onSuccess: () => {
                                            navigate({
                                                to: from ?? '/',
                                                replace: true,
                                            })
                                        },
                                    },
                                )
                            }
                        >
                            Войти через Telegram
                        </LoadingButton>
                        <Button
                            variant="outline"
                            onClick={() => {
                                telegramLogin.reset()
                                setShowEmail(true)
                            }}
                        >
                            Использовать Email
                        </Button>
                    </Stack>
                </Stack>
            ) : (
                <>
                    <Button
                        variant="outline"
                        onClick={() => {
                            telegramLogin.reset()
                            setShowEmail(false)
                        }}
                    >
                        ← Назад к Telegram
                    </Button>

                    {children}
                </>
            )}
        </>
    )
}
