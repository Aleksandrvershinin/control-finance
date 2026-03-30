import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { useMutation } from '@tanstack/react-query'
import { changePasswordApi } from '../api/changePassword.api'
import {
    ConfirmChangePasswordFormValues,
    RequestChangePasswordCodeFormValues,
} from './changePassword.types'

export const useRequestChangePasswordCodeMutation = () => {
    return useMutation({
        mutationFn: async (
            data: WithRecaptcha<RequestChangePasswordCodeFormValues>,
        ) => {
            const { data: response } = await changePasswordApi.requestCode(data)
            return response
        },
    })
}

export const useConfirmChangePasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: WithRecaptcha<ConfirmChangePasswordFormValues>) => {
            const { confirmPassword, ...dto } = data
            void confirmPassword

            const { data: response } = await changePasswordApi.confirm(dto)
            return response
        },
    })
}
