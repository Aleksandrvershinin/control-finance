import z from 'zod'

export const transactionSummarySchema = z.object({
    incomeTotal: z.number(),
    expenseTotal: z.number(),
    difference: z.number(),
})

export type TransactionSummary = z.infer<typeof transactionSummarySchema>
