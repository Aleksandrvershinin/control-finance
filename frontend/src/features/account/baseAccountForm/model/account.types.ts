import z from 'zod'

export const accountFormSchema = z.object({
    name: z.string().min(2, { message: 'Название не может быть пустым' }),
    order: z.coerce.number(),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>
