export type CategoryTypeMeta = {
    id: string
    name: string
    type: 'INCOME' | 'EXPENSE'
    icon: string
    color: string
}

export const categoriesTypeMeta = [
    {
        id: 'income',
        name: 'Доход',
        type: 'INCOME',
        icon: '💰',
        color: '#22c55e',
    },
    {
        id: 'expense',
        name: 'Расход',
        type: 'EXPENSE',
        icon: '💸',
        color: '#ef4444',
    },
] as const

export const categoriesTypeMetaMap = Object.fromEntries(
    categoriesTypeMeta.map((i) => [i.type, i]),
) as Record<CategoryTypeMeta['type'], CategoryTypeMeta>
