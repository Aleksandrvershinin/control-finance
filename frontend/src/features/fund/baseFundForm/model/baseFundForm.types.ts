import z from 'zod'

export const baseFundFormSchema = z.object({
    name: z.string().min(2, { message: 'Название слишком короткое' }),
    colorBg: z.string().regex(/^#/, { message: 'Некорректный цвет' }),
    order: z.coerce.number(),
})

export type BaseFundFormValues = z.infer<typeof baseFundFormSchema>
