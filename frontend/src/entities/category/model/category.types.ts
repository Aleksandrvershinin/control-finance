import { z } from 'zod'
import { categoriesTypeMetaMap } from './categoryTypeMeta.types'

export const categoryResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['INCOME', 'EXPENSE']),
})
export const categorySchema = categoryResponseSchema.transform((category) => {
    const meta = categoriesTypeMetaMap[category.type]

    return {
        ...category,
        icon: meta.icon,
        color: meta.color,
        typeName: meta.name,
    }
})
export const createCategoryDTOSchema = categoryResponseSchema.omit({
    id: true,
})

export const updateCategoryDTOSchema = createCategoryDTOSchema.partial()

export type CategoryType = z.infer<typeof categoryResponseSchema>['type']
export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CreateCategoryDto = z.infer<typeof createCategoryDTOSchema>
export type UpdateCategoryDto = z.infer<typeof updateCategoryDTOSchema>
export type Category = z.infer<typeof categorySchema>
