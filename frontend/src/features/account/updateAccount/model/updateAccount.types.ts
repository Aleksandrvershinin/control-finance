import z from 'zod'
import { accountFormSchema } from '../../baseAccountForm'

export const updateAccountFormSchema = accountFormSchema

export type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>
