import { CURRENT_USER_QUERY_KEY } from '@/entities/user'
import { accessToken } from '@/shared/api/accessToken.api'
import { toast } from '@/shared/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { logoutApi } from '../api/logout.api'

export const useLogoutMutation = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            await logoutApi.logout()
        },
        onSuccess: async () => {
            accessToken.removeToken()
            queryClient.clear()
            queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null)
            toast({
                title: 'Вы вышли из системы',
            })
            await router.navigate({
                to: '/login',
                search: { method: 'pass' },
            })
        },
    })
    return mutation
}
