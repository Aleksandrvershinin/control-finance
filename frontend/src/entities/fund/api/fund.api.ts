import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'
import {
    CreateFundDto,
    fundSchema,
    ReorderFundsDto,
    UpdateFundDto,
} from '../model/fund.types'
import { queryOptions } from '@tanstack/react-query'

export const ROOT_FUND_QUERY_KEY = ['funds']

export const FUND_LIST_QUERY_KEY = [...ROOT_FUND_QUERY_KEY, 'list']

export const fundApi = {
    getAll: (config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.get('/funds', config),

    getFundsQueryOptions: () => {
        return queryOptions({
            queryKey: [...FUND_LIST_QUERY_KEY],

            queryFn: async ({ signal }) => {
                const { data } = await fundApi.getAll({ signal })
                return fundSchema.array().parse(data.data || data)
            },
        })
    },

    create: (data: CreateFundDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.post('/funds', data, config),

    update: (id: string, data: UpdateFundDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.patch(`/funds/${id}`, data, config),

    reorder: (data: ReorderFundsDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.patch('/funds/reorder', data, config),

    remove: (id: string, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.delete(`/funds/${id}`, config),
}
