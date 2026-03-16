import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    ROOT_TRANSACTION_QUERY_KEY,
    transactionApi,
} from '@/entities/transaction/api/transaction.api'
import { CreateTransactionFormValues } from './createTransactionForm.types'
import { transformCreateTransactionToCreateTransactionDto } from './transformCreateTransaction'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'

export const useCreateTransactionMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (payload: CreateTransactionFormValues) => {
            const trnsformPayload =
                transformCreateTransactionToCreateTransactionDto(payload)
            const { data } = await transactionApi.create(trnsformPayload)
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
