import { accountApi } from '@/entities/account'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteAccountMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await accountApi.remove(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_ACCOUNT_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_FUND_QUERY_KEY,
            })
        },
    })
}
