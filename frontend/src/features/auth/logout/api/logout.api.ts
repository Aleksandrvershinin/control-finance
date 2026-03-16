import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'

export const logoutApi = {
    logout: (config?: AxiosRequestConfig) => {
        return apiAxiosWithAuthToken.post('/auth/logout', undefined, config)
    },
}
