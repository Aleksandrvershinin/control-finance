import {
    emailSchema,
    linkTelegramSchema,
    passwordSchema,
    telegramInitDataSchema,
} from '@/shared/lib/validation/validation.shema'
import { z } from 'zod'

export const loginByPassFormSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    linkTelegram: linkTelegramSchema,
    telegramInitData: telegramInitDataSchema,
})

export type LoginByPassFormType = z.infer<typeof loginByPassFormSchema>

export const requestLoginCodeFormSchema = z.object({
    email: emailSchema,
})

export type RequestLoginCodeFormType = z.infer<
    typeof requestLoginCodeFormSchema
>

export const confirmLoginCodeFormSchema = z.object({
    email: emailSchema,
    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Код должен состоять из 6 цифр'),
})

export type ConfirmLoginCodeFormType = z.infer<
    typeof confirmLoginCodeFormSchema
>
