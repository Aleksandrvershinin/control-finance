import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    ROOT_TRANSACTION_QUERY_KEY,
    transactionApi,
} from '@/entities/transaction/api/transaction.api'
import { UpdateTransactionDto } from '@/entities/transaction/model/transaction.types'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'

export const useUpdateTransactionMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            id: string
            data: UpdateTransactionDto
        }) => {
            const { data } = await transactionApi.update(
                payload.id,
                payload.data,
            )
            return data
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
