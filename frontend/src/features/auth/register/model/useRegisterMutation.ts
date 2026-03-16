import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accessToken } from '@/shared/api/accessToken.api'
import { CURRENT_USER_QUERY_KEY } from '@/entities/user/api/userQueryKeys'
import { RegisterFormType } from './register.types'
import { transformRegisterFormDataToDto } from './transformData'
import { registerApi } from '../api/register.api'

export const useRegisterMutation = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (formData: WithRecaptcha<RegisterFormType>) => {
            const dto = transformRegisterFormDataToDto(formData)
            const { data } = await registerApi.register(dto)
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
