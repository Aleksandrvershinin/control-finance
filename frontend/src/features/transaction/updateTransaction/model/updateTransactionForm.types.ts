import z from 'zod'
import { baseTransactionFormSchema } from '../../baseTransactionForm'

export const updateTransactionFormSchema = baseTransactionFormSchema
    .pick({
        amount: true,
        date: true,
        description: true,
    })
    .extend({
        amount: z.preprocess((val) => {
            if (typeof val === 'string') {
                return Number(val.replace(/\s/g, ''))
            }
            return val
        }, z.number()),
    })
    .partial()

export type UpdateTransactionFormValues = z.infer<
    typeof updateTransactionFormSchema
>
