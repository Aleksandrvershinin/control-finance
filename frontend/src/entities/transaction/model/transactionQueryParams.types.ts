import z from 'zod'

export const transactionQueryParamsDtoSchema = z
    .object({
        sortOrder: z.enum(['asc', 'desc']).optional(),
        sortField: z.enum(['date', 'amount', 'description']).optional(),
        cursor: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        accountIds: z.string().array().optional(),
        categoryIds: z.string().array().optional(),
        fundIds: z.string().array().optional(),
        transactionTypes: z
            .enum(['initial', 'income', 'expense', 'transfer'])
            .array()
            .optional(),
        categoryType: z.enum(['income', 'expense']).optional(),
    })
    .strict()

export type TransactionQueryParamsDto = z.infer<
    typeof transactionQueryParamsDtoSchema
>
