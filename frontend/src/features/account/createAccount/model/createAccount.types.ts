import z from 'zod'
import { accountFormSchema } from '../../baseAccountForm'

export const createAccountFormSchema = accountFormSchema.extend({
    initialBalance: z
        .preprocess((val) => {
            if (typeof val === 'string') {
                return Number(val.replace(/\s/g, ''))
            }
            return val
        }, z.number())
        .default(0),
})

export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
