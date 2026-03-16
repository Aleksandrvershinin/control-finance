import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { fundApi } from '@/entities/fund'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteFundMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await fundApi.remove(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_FUND_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_ACCOUNT_QUERY_KEY,
            })
        },
    })
}
