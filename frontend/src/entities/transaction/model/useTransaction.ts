import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '../api/transaction.api'
import { TransactionQueryParamsDto } from './transactionQueryParams.types'

type UseTransactionOptions = {
    onError?: () => void
}

export const useTransaction = (
    params: TransactionQueryParamsDto,
    options?: UseTransactionOptions,
) => {
    const queryOptions = transactionApi.getTransactionsQueryOptions(params)
    const originalQueryFn = queryOptions.queryFn

    if (!originalQueryFn) {
        return useQuery(queryOptions)
    }

    return useQuery({
        ...queryOptions,
        queryFn: async (context) => {
            try {
                return await originalQueryFn(context)
            } catch (error) {
                options?.onError?.()
                throw error
            }
        },
    })
}
