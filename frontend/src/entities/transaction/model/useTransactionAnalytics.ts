import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '../api/transaction.api'
import { TransactionQueryParamsDto } from './transactionQueryParams.types'

type UseTransactionAnalyticsOptions = {
    onError?: () => void
}

const getAnalyticsParams = (
    params: TransactionQueryParamsDto,
): TransactionQueryParamsDto => {
    const analyticsParams = { ...params }
    delete analyticsParams.cursor
    delete analyticsParams.sortField
    delete analyticsParams.sortOrder
    return analyticsParams
}

export const useTransactionAnalytics = (
    params: TransactionQueryParamsDto,
    options?: UseTransactionAnalyticsOptions,
) => {
    const queryOptions = transactionApi.getTransactionsAnalyticsQueryOptions(
        getAnalyticsParams(params),
    )
    const originalQueryFn = queryOptions.queryFn

    return useQuery({
        ...queryOptions,
        queryFn: originalQueryFn
            ? async (context) => {
                  try {
                      return await originalQueryFn(context)
                  } catch (error) {
                      options?.onError?.()
                      throw error
                  }
              }
            : queryOptions.queryFn,
    })
}
