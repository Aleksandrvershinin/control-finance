import { z } from 'zod'

export const errorResponseSchema = z.object({
    message: z.union([z.string(), z.array(z.string())]),
    error: z.string(),
    statusCode: z.number(),
})
export type TErrorResponse = z.infer<typeof errorResponseSchema>
