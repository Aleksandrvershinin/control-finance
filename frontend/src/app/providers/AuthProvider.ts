import { useSuspensCurrentUser } from '@/entities/user'
import { accessToken } from '@/shared/api/accessToken.api'
import { setLogoutHandler } from '@/shared/api/logoutHandler'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { PropsWithChildren, useCallback, useEffect } from 'react'

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { data: user } = useSuspensCurrentUser()
    const router = useRouter()
    const queryClient = useQueryClient()
    const logout = useCallback(() => {
        if (user) {
            accessToken.removeToken()
            queryClient.clear()
            router.navigate({ to: '/login', search: { method: 'pass' } })
        }
    }, [queryClient, router, user])

    useEffect(() => {
        setLogoutHandler(logout)

        return () => {
            setLogoutHandler(() => {})
        }
    }, [logout])

    return children
}
