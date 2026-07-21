import { z } from 'zod'
import { TRANSACTION_TYPES } from './constants'

export const transactionSchema = z.object({
    id: z.string(),
    amount: z.number(),
    type: z.enum([
        TRANSACTION_TYPES.INCOME,
        TRANSACTION_TYPES.EXPENSE,
        TRANSACTION_TYPES.TRANSFER,
        TRANSACTION_TYPES.INITIAL,
    ]),
    date: z.string(),
    accountId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    toAccountId: z.string().optional().nullable(),
    fundId: z.string().optional().nullable(),
    toFundId: z.string().optional().nullable(),
})

export type Transaction = z.infer<typeof transactionSchema>

export const baseTransactionDtoSchema = z.object({
    categoryId: z.string().optional().nullable(),
    amount: z.coerce.number().min(1),
    date: z.string().min(1),
    description: z.string().optional(),
})

export const createTransactionDtoSchema = baseTransactionDtoSchema.extend({
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    accountId: z.string().optional(),
    toAccountId: z.string().optional(),
    fromFundId: z.string().optional(),
    toFundId: z.string().optional(),
})

export const updateTransactionDtoSchema = baseTransactionDtoSchema
    .partial()
    .pick({
        amount: true,
        date: true,
        description: true,
    })
export type CreateTransactionDto = z.infer<typeof createTransactionDtoSchema>
export type UpdateTransactionDto = z.infer<typeof updateTransactionDtoSchema>
