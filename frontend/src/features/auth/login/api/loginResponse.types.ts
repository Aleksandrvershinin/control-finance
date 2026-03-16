import { currentUserResponseSchema } from '@/entities/user/api/userResponse.types'
import { z } from 'zod'

export const loginByPassResponseSchema = z.object({
    accessToken: z.string(),
    user: currentUserResponseSchema.shape.user,
})
export type LoginByPassResponseData = z.infer<typeof loginByPassResponseSchema>

export const requestLoginCodeResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
})
export type RequestLoginCodeResponseData = z.infer<
    typeof requestLoginCodeResponseSchema
>

export const loginByCodeResponseSchema = z.object({
    accessToken: z.string(),
    user: currentUserResponseSchema.shape.user,
})
export type LoginByCodeResponseData = z.infer<typeof loginByCodeResponseSchema>
