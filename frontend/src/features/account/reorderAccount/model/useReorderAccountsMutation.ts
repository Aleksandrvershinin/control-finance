import { accountApi, Account } from '@/entities/account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    applyAccountOrder,
    buildReorderAccountsDto,
} from '../lib/reorderAccounts'

export const useReorderAccountsMutation = () => {
    const qc = useQueryClient()
    const queryKey = accountApi.getAccountsQueryOptions().queryKey

    return useMutation({
        mutationFn: async (accountIds: string[]) => {
            const { data } = await accountApi.reorder(
                buildReorderAccountsDto(accountIds),
            )
            return data
        },
        onMutate: async (accountIds) => {
            await qc.cancelQueries({ queryKey })

            const previousAccounts = qc.getQueryData<Account[]>(queryKey)

            if (previousAccounts) {
                qc.setQueryData<Account[]>(
                    queryKey,
                    applyAccountOrder(previousAccounts, accountIds),
                )
            }

            return { previousAccounts }
        },
        onError: (_error, _accountIds, context) => {
            if (context?.previousAccounts) {
                qc.setQueryData<Account[]>(queryKey, context.previousAccounts)
            }
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey })
        },
    })
}
