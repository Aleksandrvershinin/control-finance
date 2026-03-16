import { categoryApi } from '@/entities/category'
import { ROOT_CATEGORY_QUERY_KEY } from '@/entities/category/api/category.api'
import { ROOT_TRANSACTION_QUERY_KEY } from '@/entities/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteCategoryMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await categoryApi.remove(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ROOT_TRANSACTION_QUERY_KEY,
            })
            qc.invalidateQueries({
                queryKey: ROOT_CATEGORY_QUERY_KEY,
            })
        },
    })
}
