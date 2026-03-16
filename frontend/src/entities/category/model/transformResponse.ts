import { Category, CategoryResponse } from './category.types'
import { categoriesTypeMetaMap } from './categoryTypeMeta.types'

export function transformResponseCategoryToCategory(
    category: CategoryResponse,
): Category {
    const meta = categoriesTypeMetaMap[category.type]

    return {
        ...category,
        color: meta.color,
        icon: meta.icon,
        typeName: meta.name,
    }
}
