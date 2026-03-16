import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '../api/transaction.api'
import { TransactionQueryParamsDto } from './transactionQueryParams.types'

export const useTransaction = (params: TransactionQueryParamsDto) => {
    return useQuery(transactionApi.getTransactionsQueryOptions(params))
}
