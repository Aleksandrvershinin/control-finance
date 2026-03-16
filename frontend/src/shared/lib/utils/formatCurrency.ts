export const formatCurrency = (value: number, code: string) =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: code,
    }).format(value)
