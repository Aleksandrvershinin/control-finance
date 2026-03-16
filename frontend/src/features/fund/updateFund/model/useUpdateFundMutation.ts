import { fundApi } from '@/entities/fund'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateFundDto } from '@/entities/fund'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'

export const useUpdateFundMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { id: string; data: UpdateFundDto }) => {
            const { data: result } = await fundApi.update(
                payload.id,
                payload.data,
            )
            return result
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_FUND_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_ACCOUNT_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
        },
    })
}
