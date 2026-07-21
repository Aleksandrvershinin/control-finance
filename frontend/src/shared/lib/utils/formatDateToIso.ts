/**
 * Преобразует строковую дату из формы в формат ISO-8601 для бэкенда.
 * Если дата пустая или некорректная, возвращает undefined или пустую строку.
 */
export const formatDateToIso = (dateValue: unknown): string | undefined => {
    if (typeof dateValue !== 'string' || !dateValue) {
        return undefined
    }

    const parsedDate = new Date(dateValue)

    // Проверка на Valid Date
    if (isNaN(parsedDate.getTime())) {
        return undefined
    }

    return parsedDate.toISOString()
}
