import { categoryApi } from '@/entities/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateCategoryDto } from '@/entities/category'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { ROOT_ACCOUNT_QUERY_KEY } from '@/entities/account/api/account.api'

export const useUpdateCategoryMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            id: string
            data: UpdateCategoryDto
        }) => {
            const { data: result } = await categoryApi.update(
                payload.id,
                payload.data,
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
