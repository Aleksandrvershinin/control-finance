import z from 'zod'
import { baseTransactionSchema } from '../../baseTransactionForm'

const incomeExpenseSchema = baseTransactionSchema.extend({
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    accountId: z.string().min(1, 'Счет обязателен'),
    categoryId: z.string().min(1, 'Категория обязательна'),
    fundId: z.string().optional(),
})

const transferTransactionSchema = baseTransactionSchema.extend({
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    accountId: z.string().min(1, 'Счет обязателен'),
    toAccountId: z.string().min(1, 'Счет получения обязателен'),
    fundId: z.string().optional(),
    toFundId: z.string().optional(),
})

export const createTransactionFormSchema = z
    .discriminatedUnion('type', [
        incomeExpenseSchema.extend({
            type: z.literal('INCOME'),
        }),

        incomeExpenseSchema.extend({
            type: z.literal('EXPENSE'),
        }),

        transferTransactionSchema.extend({
            type: z.literal('TRANSFER'),
        }),
    ])
    .superRefine((data, ctx) => {
        if (data.type === 'TRANSFER') {
            if (
                data.accountId === data.toAccountId &&
                data.fundId === data.toFundId
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Нельзя переводить в тот же счет и фонд',
                    path: ['toAccountId'],
                })
            }
        }
    })

export type CreateTransactionFormValues = z.infer<
    typeof createTransactionFormSchema
>
