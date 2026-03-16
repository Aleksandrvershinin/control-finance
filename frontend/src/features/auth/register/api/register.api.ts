import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { RegisterFormType } from '../model/register.types'
import { AxiosRequestConfig } from 'axios'
import { apiAxios } from '@/shared/api/axiosInstance'
import { responseContract } from '@/shared/lib/utils/responseContract'
import { registerResponseShema } from './response.types'

export const registerApi = {
    register: (
        data: Omit<WithRecaptcha<RegisterFormType>, 'confirmPassword'>,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxios
            .post(`/auth/register`, data, config)
            .then(responseContract(registerResponseShema))
    },
}
