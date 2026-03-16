import { CategoryMultiSelect, useSuspenseCategories } from '@/entities/category'
import { useMainFilterStore } from '@/features/mainFilter'

export const CategoryFilterSection = () => {
    const {
        data: { categories },
    } = useSuspenseCategories()
    const { setFilter, filters } = useMainFilterStore()
    const types = filters.transactionTypes?.map((t) => t.toUpperCase())

    const filteredCategories = categories.filter(
        (cat) => !types?.length || types.includes(cat.type),
    )

    return (
        <CategoryMultiSelect
            options={filteredCategories.map((acc) => ({
                label: acc.name,
                value: acc.id,
            }))}
            value={filters.categoryIds ?? []}
            onChange={(value) => setFilter('categoryIds', value)}
        />
    )
}
