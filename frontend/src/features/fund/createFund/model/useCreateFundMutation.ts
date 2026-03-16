import { fundApi } from '@/entities/fund'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateFundDto } from '@/entities/fund'
import { ROOT_FUND_QUERY_KEY } from '@/entities/fund/api/fund.api'

export const useCreateFundMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateFundDto) => {
            const { data: result } = await fundApi.create(data)
            return result
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_FUND_QUERY_KEY,
            })
        },
    })
}
