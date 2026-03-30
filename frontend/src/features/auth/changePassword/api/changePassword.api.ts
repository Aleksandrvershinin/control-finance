import { apiAxiosWithAuthToken } from '@/shared/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'

type RequestChangePasswordCodeDto = {
    recaptchaToken: string
}

type ConfirmChangePasswordDto = {
    code: string
    newPassword: string
    recaptchaToken: string
}

export const changePasswordApi = {
    requestCode: (
        data: RequestChangePasswordCodeDto,
        config?: AxiosRequestConfig,
    ) => {
        return apiAxiosWithAuthToken.post('/users/password/code/request', data, config)
    },
    confirm: (data: ConfirmChangePasswordDto, config?: AxiosRequestConfig) => {
        return apiAxiosWithAuthToken.patch('/users/password', data, config)
    },
}
