import { Prisma, TransactionType } from '@prisma/client'

export const transactionFilters = {
    build(dto: {
        accountIds?: string[]
        fundIds?: string[]
        dateFrom?: string
        dateTo?: string
        categoryIds?: string[]
        transactionTypes?: TransactionType[]
    }): Prisma.TransactionWhereInput[] {
        const filters: Prisma.TransactionWhereInput[] = []

        const accountsAndFunds = this.byAccountsAndFunds(
            dto.accountIds,
            dto.fundIds,
        )
        if (accountsAndFunds) filters.push(accountsAndFunds)

        const date = this.byDate(dto.dateFrom, dto.dateTo)
        if (date) filters.push(date)

        const category = this.byCategory(dto.categoryIds)
        if (category) filters.push(category)

        const type = this.byTransactionType(dto.transactionTypes)
        if (type) filters.push(type)

        return filters
    },

    byAccountsAndFunds(
        accountIds?: string[],
        fundIds?: string[],
    ): Prisma.TransactionWhereInput | undefined {
        const conditions: Prisma.LedgerEntryWhereInput[] = []

        if (accountIds?.length) {
            conditions.push({
                accountId: {
                    in: accountIds,
                },
            })
        }

        if (fundIds?.length) {
            conditions.push({
                fundId: {
                    in: fundIds,
                },
            })
        }

        if (!conditions.length) {
            return
        }

        return {
            entries: {
                some: {
                    AND: conditions,
                },
            },
        }
    },

    byDate(
        dateFrom?: string,
        dateTo?: string,
    ): Prisma.TransactionWhereInput | undefined {
        if (!dateFrom && !dateTo) return

        const date: Prisma.DateTimeFilter = {}

        if (dateFrom) {
            const from = new Date(dateFrom)
            from.setHours(0, 0, 0, 0)
            date.gte = from
        }

        if (dateTo) {
            const to = new Date(dateTo)
            to.setHours(23, 59, 59, 999)
            date.lte = to
        }

        return { date }
    },

    byCategory(
        categoryIds?: string[],
    ): Prisma.TransactionWhereInput | undefined {
        if (!categoryIds?.length) return

        return {
            categoryId: {
                in: categoryIds,
            },
        }
    },

    byTransactionType(
        transactionTypes?: TransactionType[],
    ): Prisma.TransactionWhereInput | undefined {
        if (!transactionTypes?.length) return

        return {
            type: {
                in: transactionTypes,
            },
        }
    },
}
