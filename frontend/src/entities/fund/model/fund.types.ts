import { z } from 'zod'

export const fundSchema = z.object({
    id: z.string(),
    name: z.string(),
    colorBg: z.string(),
    order: z.number(),
    currencyId: z.string(),
    amount: z.number(),
})

export const createFundDTOSchema = z.object({
    name: z.string(),
    colorBg: z.string().optional(),
    order: z.number().int().optional(),
})

export const updateFundDTOSchema = createFundDTOSchema.partial()

export const reorderFundItemSchema = z.object({
    id: z.string(),
    order: z.number().int().nonnegative(),
})

export const reorderFundsDTOSchema = z.object({
    items: reorderFundItemSchema.array().min(1),
})

export type FundType = z.infer<typeof fundSchema>
export type CreateFundDto = z.infer<typeof createFundDTOSchema>
export type UpdateFundDto = z.infer<typeof updateFundDTOSchema>
export type ReorderFundsDto = z.infer<typeof reorderFundsDTOSchema>
