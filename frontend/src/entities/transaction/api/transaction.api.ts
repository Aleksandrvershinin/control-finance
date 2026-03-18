import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'
import {
    CreateTransactionDto,
    UpdateTransactionDto,
} from '../model/transaction.types'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { TransactionQueryParamsDto } from '../model/transactionQueryParams.types'
import { transactionsListResponseSchema } from '../model/transactionListResponse.types'
import { transactionAnalyticsSchema } from '../model/transactionAnalytics.types'
import { transactionSummarySchema } from '../model/transactionSummary.types'
import * as qs from 'qs'

export const ROOT_TRANSACTION_QUERY_KEY = ['transactions']

export const TRANSACTION_LIST_QUERY_KEY = [
    ...ROOT_TRANSACTION_QUERY_KEY,
    'list',
]

export const TRANSACTION_SUMMARY_QUERY_KEY = [
    ...ROOT_TRANSACTION_QUERY_KEY,
    'summary',
]

export const TRANSACTION_ANALYTICS_QUERY_KEY = [
    ...ROOT_TRANSACTION_QUERY_KEY,
    'analytics',
]

export const transactionApi = {
    getAll: (
        params: TransactionQueryParamsDto,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxiosWithAuthToken.get('/transactions', {
            ...config,
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
    },

    getTransactionsQueryOptions: (params: TransactionQueryParamsDto) => {
        return queryOptions({
            queryKey: [...TRANSACTION_LIST_QUERY_KEY, params],
            queryFn: async ({ signal }) => {
                const { data } = await transactionApi.getAll(params, { signal })
                return transactionsListResponseSchema.parse(data)
            },
            placeholderData: keepPreviousData,
        })
    },

    getSummary: (
        params: TransactionQueryParamsDto,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxiosWithAuthToken.get('/transactions/summary', {
            ...config,
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
    },

    getTransactionsSummaryQueryOptions: (params: TransactionQueryParamsDto) => {
        return queryOptions({
            queryKey: [...TRANSACTION_SUMMARY_QUERY_KEY, params],
            queryFn: async ({ signal }) => {
                const { data } = await transactionApi.getSummary(params, {
                    signal,
                })
                return transactionSummarySchema.parse(data.data || data)
            },
            placeholderData: keepPreviousData,
        })
    },

    getAnalytics: (
        params: TransactionQueryParamsDto,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxiosWithAuthToken.get('/transactions/analytics', {
            ...config,
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
    },

    getTransactionsAnalyticsQueryOptions: (
        params: TransactionQueryParamsDto,
    ) => {
        return queryOptions({
            queryKey: [...TRANSACTION_ANALYTICS_QUERY_KEY, params],
            queryFn: async ({ signal }) => {
                const { data } = await transactionApi.getAnalytics(params, {
                    signal,
                })
                return transactionAnalyticsSchema.parse(data.data || data)
            },
            placeholderData: keepPreviousData,
        })
    },

    create: (payload: CreateTransactionDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.post('/transactions', payload, config),
    update: (
        id: string,
        payload: UpdateTransactionDto,
        config?: AxiosRequestConfig,
    ) => apiAxiosWithAuthToken.patch(`/transactions/${id}`, payload, config),

    remove: (id: string, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.delete(`/transactions/${id}`, config),
}
