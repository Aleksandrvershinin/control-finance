import { categoryApi } from '@/entities/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCategoryDto } from '@/entities/category'

export const useCreateCategoryMutation = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateCategoryDto) => {
            const { data: result } = await categoryApi.create(data)
            return result
        },
        onSuccess: () => {
            qc.invalidateQueries(categoryApi.getCategoriesQueryOptions())
        },
    })
}
