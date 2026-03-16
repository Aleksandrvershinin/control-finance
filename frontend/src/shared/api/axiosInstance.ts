import axios from 'axios'
import { accessToken } from './accessToken.api'
import { triggerLogout } from './logoutHandler'
import { normalizeError } from '../lib/errors/normalizeError'

export const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL as string
export const PUBLIC_API_URL = `${PUBLIC_URL}/api`

let refreshPromise: Promise<string> | null = null

type RetryableAxiosConfig = {
    _isRetry?: boolean
}

const axiosDefault = {
    baseURL: PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
}

export const apiAxios = axios.create(axiosDefault)
export const apiAxiosWithAuthToken = axios.create(axiosDefault)

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = apiAxios
            .post('/auth/refresh')
            .then((response) => {
                const token = response.data?.accessToken
                if (typeof token !== 'string' || !token) {
                    throw new Error('Invalid refresh response')
                }

                accessToken.setToken(token)
                return token
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

apiAxiosWithAuthToken.interceptors.request.use((config) => {
    const token = accessToken.getToken()

    if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

apiAxiosWithAuthToken.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableAxiosConfig | undefined

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            try {
                originalRequest._isRetry = true
                const token = await refreshAccessToken()

                if (!error.config.headers) {
                    error.config.headers = {}
                }

                error.config.headers.Authorization = `Bearer ${token}`
                return apiAxiosWithAuthToken.request(error.config)
            } catch {
                accessToken.removeToken()
                await triggerLogout()
            }
        }

        return Promise.reject(normalizeError(error))
    },
)
apiAxios.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(normalizeError(error)),
)
// apiAxiosWithAuthToken.interceptors.response.use(
//     (config) => {
//         return config
//     },
//     async (error) => {
//         const originalRequest = error.config
//         if (
//             error.response.status === 401 &&
//             error.config &&
//             !error.config._isRetry
//         ) {
//             originalRequest._isRetry = true
//             try {
//                 const response = await authApi.refreshTokens()
//                 accessToken.setToken(response.data.data.accessToken)
//                 return apiAxiosWithAuthToken.request(originalRequest)
//             } catch (error) {
//                 accessToken.removeToken()
//                 store.dispatch({ type: changeAuth, payload: false })
//             }
//         } else {
//             return Promise.reject(error)
//         }
//     },
// )
