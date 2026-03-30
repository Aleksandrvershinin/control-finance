import { passwordSchema } from '@/shared/lib/validation/validation.shema'
import { z } from 'zod'

export const requestChangePasswordCodeFormSchema = z.object({})

export type RequestChangePasswordCodeFormValues = z.infer<
    typeof requestChangePasswordCodeFormSchema
>

export const confirmChangePasswordFormSchema = z
    .object({
        code: z
            .string()
            .trim()
            .regex(/^\d{6}$/, 'Код должен состоять из 6 цифр'),
        newPassword: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    })

export type ConfirmChangePasswordFormValues = z.infer<
    typeof confirmChangePasswordFormSchema
>
