import { ValidationError } from '@nestjs/common'

function extractNumber(error: ValidationError, rule: string): number | null {
    try {
        const contextValue =
            error?.contexts?.[rule]?.[rule] ??
            error?.contexts?.[rule]?.value ??
            error?.constraints?.[rule]

        if (typeof contextValue === 'number' && !isNaN(contextValue)) {
            return contextValue
        }

        if (typeof contextValue === 'string') {
            const match = contextValue.match(/\d+/)
            if (match) return Number(match[0])
        }

        const message = error?.constraints?.[rule]

        if (typeof message === 'string') {
            const match = message.match(/\d+/)
            if (match) return Number(match[0])
        }

        return null
    } catch {
        return null
    }
}

function pluralForm(count: number, words: [string, string, string]) {
    const n = Math.abs(count)

    if (n % 10 === 1 && n % 100 !== 11) return words[0]

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        return words[1]
    }

    return words[2]
}

function extractEnumValues(error: ValidationError): string {
    try {
        const values =
            error?.constraints?.isEnum ||
            error?.contexts?.isEnum?.constraints?.[0]

        if (Array.isArray(values)) return values.join(', ')
        if (typeof values === 'string') return values

        return ''
    } catch {
        return ''
    }
}

type Handler = (e: ValidationError) => string

export const validationMessageMap: Record<string, Handler> = {
    isDefined: (e) => `${e?.property ?? 'Поле'} обязательно для заполнения`,

    isNotEmpty: (e) => `${e?.property ?? 'Поле'} не должно быть пустым`,

    isString: (e) => `${e?.property ?? 'Поле'} должен быть строкой`,

    isNumber: (e) => `${e?.property ?? 'Поле'} должен быть числом`,

    isInt: (e) => `${e?.property ?? 'Поле'} должен быть целым числом`,

    isBoolean: (e) => `${e?.property ?? 'Поле'} должен быть булевым значением`,

    isEmail: () => `Некорректный email`,

    minLength: (e) => {
        const min = extractNumber(e, 'minLength')

        if (min === null) return `${e?.property ?? 'Поле'} слишком короткий`

        const word = pluralForm(min, ['символ', 'символа', 'символов'])

        return `${e?.property ?? 'Поле'} должен содержать минимум ${min} ${word}`
    },

    maxLength: (e) => {
        const max = extractNumber(e, 'maxLength')

        if (max === null) return `${e?.property ?? 'Поле'} слишком длинный`

        const word = pluralForm(max, ['символ', 'символа', 'символов'])

        return `${e?.property ?? 'Поле'} должен содержать максимум ${max} ${word}`
    },

    min: (e) => {
        const min = extractNumber(e, 'min')

        if (min === null) return `${e?.property ?? 'Поле'} слишком маленький`

        return `${e?.property ?? 'Поле'} должен быть не меньше ${min}`
    },

    max: (e) => {
        const max = extractNumber(e, 'max')

        if (max === null) return `${e?.property ?? 'Поле'} слишком большой`

        return `${e?.property ?? 'Поле'} должен быть не больше ${max}`
    },

    isEnum: (e) => {
        const values = extractEnumValues(e)

        if (!values)
            return `${e?.property ?? 'Поле'} имеет недопустимое значение`

        return `${e?.property ?? 'Поле'} должен быть одним из: ${values}`
    },

    isUUID: (e) => `${e?.property ?? 'Поле'} должен быть корректным UUID`,
}
