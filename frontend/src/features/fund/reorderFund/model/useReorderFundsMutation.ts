import { FundType, fundApi } from '@/entities/fund'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyFundOrder, buildReorderFundsDto } from '../lib/reorderFunds'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'

export const useReorderFundsMutation = () => {
    const qc = useQueryClient()
    const queryKey = fundApi.getFundsQueryOptions().queryKey

    return useMutation({
        mutationFn: async (fundIds: string[]) => {
            const { data } = await fundApi.reorder(
                buildReorderFundsDto(fundIds),
            )
            return data
        },
        onMutate: async (fundIds) => {
            await qc.cancelQueries({ queryKey })

            const previousFunds = qc.getQueryData<FundType[]>(queryKey)

            if (previousFunds) {
                qc.setQueryData<FundType[]>(
                    queryKey,
                    applyFundOrder(previousFunds, fundIds),
                )
            }

            return { previousFunds }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ROOT_ACCOUNT_QUERY_KEY })
        },
        onError: (_error, _fundIds, context) => {
            if (context?.previousFunds) {
                qc.setQueryData<FundType[]>(queryKey, context.previousFunds)
            }
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey })
        },
    })
}
