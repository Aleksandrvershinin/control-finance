import { userApi } from '@/entities/user'
import { CURRENT_USER_QUERY_KEY } from '@/entities/user/api/userQueryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateCurrencyMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userApi.updateCurrentUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: CURRENT_USER_QUERY_KEY,
            })
        },
    })
}
