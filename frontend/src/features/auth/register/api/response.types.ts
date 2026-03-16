import { currentUserSchema } from '@/entities/user/model/user.types'
import z from 'zod'

export const registerResponseShema = z.object({
    accessToken: z.string(),
    user: currentUserSchema,
})
