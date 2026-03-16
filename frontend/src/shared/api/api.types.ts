import { z } from 'zod'

export const responseErrorSchema = z.object({
    message: z.string(),
    error: z.string(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
})

export type ResponseErrorType = z.infer<typeof responseErrorSchema>
