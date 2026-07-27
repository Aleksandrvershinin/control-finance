import {
    emailSchema,
    linkTelegramSchema,
    passwordSchema,
    telegramInitDataSchema,
} from '@/shared/lib/validation/validation.shema'
import z from 'zod'

export const registerFormSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
        currencyId: z.string().min(1, 'Выберите валюту'),
        linkTelegram: linkTelegramSchema,
        telegramInitData: telegramInitDataSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    })

export type RegisterFormType = z.infer<typeof registerFormSchema>
