import z from 'zod'

export const transactionFields = {
    accountId: z.string({ message: 'Счет обязателен' }),
    toAccountId: z.string({ message: 'Счет обязателен' }),
    categoryId: z.string().min(1, 'Категория обязательна'),
    fundId: z.string().optional().nullable(),
    toFundId: z.string().optional().nullable(),
    amount: z.preprocess(
        (val) => {
            if (typeof val === 'string') {
                return Number(val.replace(/\s/g, ''))
            }
            return val
        },
        z
            .number({ message: 'Сумма обязательна' })
            .min(1, 'Сумма должна быть больше 0'),
    ),
    date: z.string().min(1, 'Дата обязательна'),
    description: z.string().optional(),
}

export const baseTransactionFormSchema = z.object({
    categoryId: transactionFields.categoryId,
    amount: transactionFields.amount,
    date: transactionFields.date,
    description: transactionFields.description,
})

export type BaseTransactionFormValues = z.infer<
    typeof baseTransactionFormSchema
>
