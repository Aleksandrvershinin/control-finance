import { useSuspenseQuery } from '@tanstack/react-query'
import { Category, categoryApi } from '@/entities/category'

export const useSuspenseCategories = () => {
    return useSuspenseQuery({
        ...categoryApi.getCategoriesQueryOptions(),
        select: (categories) => {
            const categoriesMap = new Map<string, Category>()
            for (const cat of categories) categoriesMap.set(cat.id, cat)
            return { categories, categoriesMap }
        },
    })
}
