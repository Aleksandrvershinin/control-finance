export type MainFilterParams = {
    sortOrder?: 'asc' | 'desc'
    sortField?: 'date' | 'amount' | 'description'
    cursor?: string
    filters: {
        dateFrom?: string
        dateTo?: string
        accountIds?: string[]
        categoryIds?: string[]
        fundIds?: string[]
        transactionTypes?: ('initial' | 'income' | 'expense' | 'transfer')[]
        categoryType?: 'income' | 'expense'
    }
}

export type FilterKeys = keyof NonNullable<MainFilterParams['filters']>
