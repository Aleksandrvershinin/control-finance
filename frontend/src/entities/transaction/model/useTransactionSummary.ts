import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '../api/transaction.api'
import { TransactionQueryParamsDto } from './transactionQueryParams.types'

type UseTransactionSummaryOptions = {
    onError?: () => void
}

const getSummaryParams = (
    params: TransactionQueryParamsDto,
): TransactionQueryParamsDto => {
    const summaryParams = { ...params }
    delete summaryParams.cursor
    delete summaryParams.sortField
    delete summaryParams.sortOrder
    return summaryParams
}

export const useTransactionSummary = (
    params: TransactionQueryParamsDto,
    options?: UseTransactionSummaryOptions,
) => {
    const queryOptions = transactionApi.getTransactionsSummaryQueryOptions(
        getSummaryParams(params),
    )
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
