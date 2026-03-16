import { getDeclension } from '../lib/utils/getDeclension'

export const validationMessages = {
    required: 'Это поле обязательно',
    email: 'Некорректный email',
    minLength: (length: number) =>
        `Минимальная длина — ${length} ${getDeclension(length, [
            'символ',
            'символа',
            'символов',
        ])}`,
    maxLength: (length: number) =>
        `Минимальная длина — ${length} ${getDeclension(length, [
            'символ',
            'символа',
            'символов',
        ])}`,
    minLengthNumber: (length: number) => `Минимальное значение — ${length} `,
    maxLengthNumber: (length: number) => `Максимальное значение — ${length}`,
    mustNumber: 'Должно быть числом',
    invalidDate: 'Некорректная дата',
}
