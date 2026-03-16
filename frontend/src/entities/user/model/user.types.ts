import { z } from 'zod'

export const currentUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    currencyId: z.string(),
})
export type CurrentUser = z.infer<typeof currentUserSchema>
