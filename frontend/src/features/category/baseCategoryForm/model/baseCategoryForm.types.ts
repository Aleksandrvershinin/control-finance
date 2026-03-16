import z from 'zod'

export const categoryFormSchema = z.object({
    name: z.string().min(1, { message: 'Название обязательно' }),
    type: z.enum(['INCOME', 'EXPENSE'], { message: 'Выберите тип категории' }),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
