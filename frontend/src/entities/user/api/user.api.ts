import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { responseContract } from '@/shared/lib/utils/responseContract'
import { AxiosRequestConfig } from 'axios'
import { currentUserResponseSchema } from './userResponse.types'
import { queryOptions } from '@tanstack/react-query'
import { CURRENT_USER_QUERY_KEY } from './userQueryKeys'
import { transformCurrentUserResponseToCurrentUser } from '../lib/toCurrentUser'

export const userApi = {
    getCurrentUser: (config?: AxiosRequestConfig) => {
        return apiAxiosWithAuthToken
            .get(`/users/me`, config)
            .then(responseContract(currentUserResponseSchema))
    },
    getCurrentUserQueryOptions: () => {
        return queryOptions({
            queryKey: [...CURRENT_USER_QUERY_KEY],

            queryFn: async ({ signal }) => {
                try {
                    const { data } = await userApi.getCurrentUser({ signal })
                    const currentUser =
                        transformCurrentUserResponseToCurrentUser(data)
                    return currentUser
                } catch (error) {
                    return null
                }
            },
        })
    },
}
