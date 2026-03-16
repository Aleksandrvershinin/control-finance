import { z } from 'zod'
import { currentUserSchema } from '../model/user.types'

export const currentUserResponseSchema = z.object({
    user: currentUserSchema,
})
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>
