export type TransactionTypeMeta = {
    id: string
    name: string
    type: 'INCOME' | 'EXPENSE' | 'INITIAL' | 'TRANSFER'
    icon: string
    color: string
}

export const transactionsTypeMeta: TransactionTypeMeta[] = [
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
    {
        id: 'initial',
        name: 'Начальный баланс',
        type: 'INITIAL',
        icon: '🏦',
        color: '#22c55e',
    },
    {
        id: 'transfer',
        name: 'Перевод',
        type: 'TRANSFER',
        icon: '🔄',
        color: '#aa66cc',
    },
]
