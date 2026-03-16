import { z } from 'zod'
const MIN_PASSWORD_LENGTH = 4
export const emailSchema = z.string().email('Некорректный email')
export const passwordSchema = z
    .string()
    .min(
        MIN_PASSWORD_LENGTH,
        `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
    )
