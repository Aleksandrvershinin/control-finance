import { useSuspensCurrentUser } from '@/entities/user'
import { useLoginTelegramMutation } from '@/features/auth/login'
import { accessToken } from '@/shared/api/accessToken.api'
import { setUnauthorizedHandler } from '@/shared/api/unauthorizedHandler'
import { telegramService } from '@/shared/lib/telegramService'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { PropsWithChildren, useCallback, useEffect } from 'react'

export const AuthProvider = ({ children }: PropsWithChildren) => {
    useSuspensCurrentUser()

    const telegramLogin = useLoginTelegramMutation()
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleUnauthorized = useCallback(async () => {
        accessToken.removeToken()

        if (telegramService.initData) {
            try {
                await telegramLogin.mutateAsync({
                    initData: telegramService.initData,
                })
                return
            } catch (error) {
                console.error(error)
            }
        }

        queryClient.clear()

        router.navigate({ to: '/login', search: { method: 'pass' } })
    }, [queryClient, router, telegramLogin])

    useEffect(() => {
        setUnauthorizedHandler(handleUnauthorized)

        return () => {
            setUnauthorizedHandler(() => {})
        }
    }, [handleUnauthorized])

    return children
}
