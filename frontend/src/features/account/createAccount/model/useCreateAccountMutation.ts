import { accountApi } from '@/entities/account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transformAccountFormToDto } from '../../baseAccountForm'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { CreateAccountFormValues } from './createAccount.types'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'

export const useCreateAccountMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateAccountFormValues) => {
            const { data: result } = await accountApi.create(
                transformAccountFormToDto(data),
            )
            return result
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_ACCOUNT_QUERY_KEY,
            })
        },
    })
}
