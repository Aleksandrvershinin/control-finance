export const TRANSACTION_TYPES = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
    TRANSFER: 'TRANSFER',
    INITIAL: 'INITIAL',
} as const
export const TRANSFER_TYPES = {
    ACCOUNTS: 'ACCOUNTS',
    FUNDS: 'FUNDS',
} as const

export const DEFAULT_TRANSACTION_ACCOUNT_ID = ''
export const DEFAULT_TRANSACTION_TYPE = TRANSACTION_TYPES.EXPENSE
export const DEFAULT_TRANSACTION_DATE = new Date().toISOString().split('T')[0]
export const DEFAULT_TRANSACTION_DESCRIPTION = ''
export const DEFAULT_TRANSACTION_CATEGORY_ID = ''

export const transactionsTypeMeta = [
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
] as const
