import { accountApi } from '@/entities/account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transformUpdateAccountFormToUpdateAccountDto } from './transformUpdateAccountFormToUpdateAccountDto'
import { UpdateAccountFormValues } from './updateAccount.types'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'

export const useUpdateAccountMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string
            data: UpdateAccountFormValues
        }) => {
            const { data: result } = await accountApi.update(
                id,
                transformUpdateAccountFormToUpdateAccountDto(data),
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
