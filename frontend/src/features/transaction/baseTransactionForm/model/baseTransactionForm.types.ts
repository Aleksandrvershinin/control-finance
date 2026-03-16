import z from 'zod'
export const baseTransactionSchema = z.object({
    categoryId: z.string().optional().nullable(),
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
})

export type BaseTransactionFormValues = z.infer<typeof baseTransactionSchema>
