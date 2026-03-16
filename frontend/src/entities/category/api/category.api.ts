import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'
import {
    CreateCategoryDto,
    categoryResponseSchema,
    UpdateCategoryDto,
} from '../model/category.types'
import { queryOptions } from '@tanstack/react-query'
import { transformResponseCategoryToCategory } from '../model/transformResponse'

export const ROOT_CATEGORY_QUERY_KEY = ['categories']

export const CATEGORY_LIST_QUERY_KEY = [...ROOT_CATEGORY_QUERY_KEY, 'list']

export const categoryApi = {
    getAll: (config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.get('/categories', config),

    getCategoriesQueryOptions: () => {
        return queryOptions({
            queryKey: [...CATEGORY_LIST_QUERY_KEY],
            queryFn: async ({ signal }) => {
                const { data } = await categoryApi.getAll({ signal })
                const parse = categoryResponseSchema
                    .array()
                    .parse(data.data || data)
                return parse.map(transformResponseCategoryToCategory)
            },
        })
    },

    create: (data: CreateCategoryDto, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.post('/categories', data, config),

    update: (
        id: string,
        data: UpdateCategoryDto,
        config?: AxiosRequestConfig,
    ) => apiAxiosWithAuthToken.put(`/categories/${id}`, data, config),

    remove: (id: string, config?: AxiosRequestConfig) =>
        apiAxiosWithAuthToken.delete(`/categories/${id}`, config),
}
