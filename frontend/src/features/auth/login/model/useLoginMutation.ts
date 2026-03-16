import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginApi } from '../api/login.api'
import {
    ConfirmLoginCodeFormType,
    LoginByPassFormType,
    RequestLoginCodeFormType,
} from './login.types'
import { accessToken } from '@/shared/api/accessToken.api'
import { CURRENT_USER_QUERY_KEY } from '@/entities/user/api/userQueryKeys'

export const useLoginByPassMutation = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (
            loginByPassForm: WithRecaptcha<LoginByPassFormType>,
        ) => {
            const { data } = await loginApi.loginByPass(loginByPassForm)
            return data
        },
        onSuccess: (data) => {
            accessToken.setToken(data.accessToken)
            queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user)
            queryClient.invalidateQueries()
        },
    })

    return mutation
}

export const useRequestLoginCodeMutation = () => {
    return useMutation({
        mutationFn: async (
            requestLoginCodeForm: WithRecaptcha<RequestLoginCodeFormType>,
        ) => {
            const { data } =
                await loginApi.requestLoginCode(requestLoginCodeForm)
            return data
        },
    })
}

export const useLoginByCodeMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (
            loginByCodeForm: WithRecaptcha<ConfirmLoginCodeFormType>,
        ) => {
            const { data } = await loginApi.loginByCode(loginByCodeForm)
            return data
        },
        onSuccess: (data) => {
            accessToken.setToken(data.accessToken)
            queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user)
            queryClient.invalidateQueries()
        },
    })
}
