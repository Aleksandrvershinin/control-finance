import { apiAxios } from '@/shared/api/axiosInstance'
import { responseContract } from '@/shared/lib/utils/responseContract'
import { AxiosRequestConfig } from 'axios'
import {
    ConfirmLoginCodeFormType,
    LoginByPassFormType,
    RequestLoginCodeFormType,
} from '../model/login.types'
import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import {
    loginByCodeResponseSchema,
    loginByPassResponseSchema,
    requestLoginCodeResponseSchema,
} from './loginResponse.types'

export const loginApi = {
    loginByPass: (
        data: WithRecaptcha<LoginByPassFormType>,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxios
            .post(`/auth/login`, data, config)
            .then(responseContract(loginByPassResponseSchema))
    },
    requestLoginCode: (
        data: WithRecaptcha<RequestLoginCodeFormType>,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxios
            .post(`/auth/login/code/request`, data, config)
            .then(responseContract(requestLoginCodeResponseSchema))
    },
    loginByCode: (
        data: WithRecaptcha<ConfirmLoginCodeFormType>,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxios
            .post(`/auth/login/code/confirm`, data, config)
            .then(responseContract(loginByCodeResponseSchema))
    },
}
