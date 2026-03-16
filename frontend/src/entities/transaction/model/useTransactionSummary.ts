import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '../api/transaction.api'
import { TransactionQueryParamsDto } from './transactionQueryParams.types'

const getSummaryParams = (
    params: TransactionQueryParamsDto,
): TransactionQueryParamsDto => {
    const summaryParams = { ...params }
    delete summaryParams.cursor
    delete summaryParams.sortField
    delete summaryParams.sortOrder
    return summaryParams
}

export const useTransactionSummary = (params: TransactionQueryParamsDto) => {
    return useQuery(
        transactionApi.getTransactionsSummaryQueryOptions(
            getSummaryParams(params),
        ),
    )
}
