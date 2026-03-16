import z from 'zod'
import { baseFundFormSchema } from '../../baseFundForm/model/baseFundForm.types'

export const updateFundFormSchema = baseFundFormSchema.partial()

export type UpdateFundFormValues = z.infer<typeof updateFundFormSchema>
