import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'
import {
    CreateAccountDto,
    ReorderAccountsDto,
    UpdateAccountDto,
    accountSchema,
} from '../model/account.types'
import { queryOptions } from '@tanstack/react-query'

export const ROOT_ACCOUNT_QUERY_KEY = ['accounts']

export const ACCOUNT_LIST_QUERY_KEY = [...ROOT_ACCOUNT_QUERY_KEY, 'list']

export const accountApi = {
    getAll: (config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.get('/accounts', config),

    create: (data: CreateAccountDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.post('/accounts', data, config),

    update: (id: string, data: UpdateAccountDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.patch(`/accounts/${id}`, data, config),

    reorder: (data: ReorderAccountsDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.patch('/accounts/reorder', data, config),

    remove: (id: string, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.delete(`/accounts/${id}`, config),

    getAccountsQueryOptions: () => {
        return queryOptions({
            queryKey: [...ACCOUNT_LIST_QUERY_KEY],

            queryFn: async ({ signal }) => {
                const { data } = await accountApi.getAll({ signal })
                return accountSchema.array().parse(data.data || data)
            },
        })
    },
}
