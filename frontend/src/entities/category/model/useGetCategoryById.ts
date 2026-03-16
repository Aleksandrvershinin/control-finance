import { Category } from './category.types'
import { useSuspenseCategories } from './useSuspenseCategories'

export const useGetCategoryById = () => {
    const {
        data: { categoriesMap },
    } = useSuspenseCategories()
    const getCategoryByid = (categoryId: string): Category | null => {
        const category = categoriesMap.get(categoryId)
        return category ?? null
    }

    return getCategoryByid
}
