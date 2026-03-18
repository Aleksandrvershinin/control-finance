import z from 'zod'

const analyticsOverviewSchema = z.object({
    incomeTotal: z.number(),
    expenseTotal: z.number(),
    transferTotal: z.number(),
    net: z.number(),
    transactionsCount: z.number(),
    incomeCount: z.number(),
    expenseCount: z.number(),
    transferCount: z.number(),
    averageIncome: z.number(),
    averageExpense: z.number(),
    largestIncome: z.number(),
    largestExpense: z.number(),
})

const analyticsCategoryItemSchema = z.object({
    categoryId: z.string().nullable(),
    categoryName: z.string(),
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.number(),
    count: z.number(),
    share: z.number(),
})

const analyticsAccountItemSchema = z.object({
    accountId: z.string(),
    accountName: z.string(),
    initialBalance: z.number(),
    income: z.number(),
    expense: z.number(),
    transferIn: z.number(),
    transferOut: z.number(),
    net: z.number(),
    transactionCount: z.number(),
})

const analyticsFundItemSchema = z.object({
    fundId: z.string().nullable(),
    fundName: z.string(),
    colorBg: z.string().nullable(),
    income: z.number(),
    expense: z.number(),
    transferIn: z.number(),
    transferOut: z.number(),
    net: z.number(),
    transactionCount: z.number(),
})

const analyticsDateItemSchema = z.object({
    date: z.string(),
    income: z.number(),
    expense: z.number(),
    transfer: z.number(),
    net: z.number(),
})

export const transactionAnalyticsSchema = z.object({
    overview: analyticsOverviewSchema,
    byCategory: analyticsCategoryItemSchema.array(),
    byAccount: analyticsAccountItemSchema.array(),
    byFund: analyticsFundItemSchema.array(),
    byDate: analyticsDateItemSchema.array(),
})

export type TransactionAnalytics = z.infer<typeof transactionAnalyticsSchema>
