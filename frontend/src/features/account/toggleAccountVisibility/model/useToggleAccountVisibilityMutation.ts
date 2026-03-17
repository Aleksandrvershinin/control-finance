import { accountApi } from '@/entities/account'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useToggleAccountVisibilityMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            isHidden,
        }: {
            id: string
            isHidden: boolean
        }) => {
            const { data } = await accountApi.update(id, { isHidden })
            return data
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_ACCOUNT_QUERY_KEY,
            })
        },
    })
}
