import { z } from 'zod'

export const accountSchema = z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    initialBalance: z.number(),
    balance: z.number().optional(),
    currencyId: z.string(),
    funds: z
        .object({
            id: z.string(),
            name: z.string(),
            colorBg: z.string(),
            balance: z.number(),
        })
        .array()
        .default([]),
})

export const createAccountDTOSchema = accountSchema.omit({
    id: true,
    balance: true,
    funds: true,
    currencyId: true,
})

export const updateAccountDTOSchema = createAccountDTOSchema.omit({
    initialBalance: true,
})

export const reorderAccountItemSchema = z.object({
    id: z.string(),
    order: z.number().int().nonnegative(),
})

export const reorderAccountsDTOSchema = z.object({
    items: reorderAccountItemSchema.array().min(1),
})

export type Account = z.infer<typeof accountSchema>
export type CreateAccountDto = z.infer<typeof createAccountDTOSchema>
export type UpdateAccountDto = z.infer<typeof updateAccountDTOSchema>
export type ReorderAccountsDto = z.infer<typeof reorderAccountsDTOSchema>
