import z from 'zod'
import { transactionSchema } from './transaction.types'

export const transactionsListResponseSchema = z.object({
    data: transactionSchema.array().default([]),
    nextCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
})

export type TransactionsListResponse = z.infer<
    typeof transactionsListResponseSchema
>
