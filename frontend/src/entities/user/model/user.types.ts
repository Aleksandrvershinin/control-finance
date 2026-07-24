import { z } from 'zod'

export const currentUserSchema = z.object({
    id: z.string(),
    currencyId: z.string().nullable().optional(),
})
export type CurrentUser = z.infer<typeof currentUserSchema>
