import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CategoryType } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { GetTransactionsDto } from './dto/get-transactions.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Prisma, TransactionType } from '@prisma/client'
import { LedgerService } from 'src/ledger/ledger.service'
import { mapTransaction } from './transactions.mapper'

type Tx = Prisma.TransactionClient

@Injectable()
export class TransactionsService {
    constructor(
        private prisma: PrismaService,
        private ledgerService: LedgerService,
    ) {}
    async createTx(
        tx: Prisma.TransactionClient,
        userId: string,
        dto: Omit<
            CreateTransactionDto,
            'type' | 'categoryId' | 'toAccountId'
        > & {
            type: TransactionType
            categoryId?: string
            toAccountId?: string
        },
    ) {
        await this.assertAccountOwnership(tx, userId, dto.accountId)
        await this.assertAccountOwnership(tx, userId, dto.toAccountId)

        await this.assertFundOwnership(tx, userId, dto.fundId)
        await this.assertFundOwnership(tx, userId, dto.toFundId)

        const amount = this.calculateAmount(dto.type, dto.amount)

        const transaction = await tx.transaction.create({
            data: {
                amount,
                type: dto.type,
                description: dto.description,
                date: new Date(dto.date),
                categoryId: dto.categoryId,
            },
        })

        const createdEntries = await this.ledgerService.createLedgerEntries({
            prisma: tx,
            transactionId: transaction.id,
            type: dto.type,
            accountId: dto.accountId,
            fundId: dto.fundId,
            amount,
            toAccountId: dto.toAccountId,
            toFundId: dto.toFundId,
        })

        return mapTransaction(transaction, createdEntries)
    }
    create(userId: string, dto: CreateTransactionDto) {
        return this.prisma.$transaction((tx) => this.createTx(tx, userId, dto))
    }

    async update(
        userId: string,
        transactionId: string,
        dto: UpdateTransactionDto,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const current = await tx.transaction.findUnique({
                where: { id: transactionId },
                include: { entries: true },
            })

            if (!current) {
                throw new NotFoundException('Transaction not found')
            }

            await Promise.all(
                current.entries.map((entry) =>
                    this.assertAccountOwnership(tx, userId, entry.accountId),
                ),
            )

            const mappedCurrent = mapTransaction(current, current.entries)
            const type = current.type
            const accountId = mappedCurrent.accountId
            const toAccountId = mappedCurrent.toAccountId ?? undefined
            const fundId = mappedCurrent.fundId ?? undefined
            const toFundId = mappedCurrent.toFundId ?? undefined

            if (!accountId) {
                throw new BadRequestException('Account is required')
            }

            if (type === TransactionType.TRANSFER && !toAccountId) {
                throw new BadRequestException(
                    'toAccountId is required for transfer transaction',
                )
            }

            await this.assertAccountOwnership(tx, userId, accountId)
            await this.assertAccountOwnership(tx, userId, toAccountId)
            await this.assertFundOwnership(tx, userId, fundId)
            await this.assertFundOwnership(tx, userId, toFundId)

            const sourceAmount = dto.amount ?? mappedCurrent.amount
            const amount = this.calculateAmount(type, sourceAmount)

            const transaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    amount,
                    description:
                        dto.description !== undefined
                            ? dto.description
                            : current.description,
                    date: dto.date ? new Date(dto.date) : current.date,
                },
            })

            await this.ledgerService.revert(tx, current.entries)

            const createdEntries = await this.ledgerService.createLedgerEntries(
                {
                    prisma: tx,
                    transactionId,
                    type,
                    accountId,
                    fundId,
                    amount,
                    toAccountId,
                    toFundId,
                },
            )

            return mapTransaction(transaction, createdEntries)
        })
    }

    async remove(userId: string, transactionId: string) {
        return this.prisma.$transaction(async (tx) => {
            const current = await tx.transaction.findUnique({
                where: { id: transactionId },
                include: { entries: true },
            })
            if (!current) {
                throw new NotFoundException('Transaction not found')
            }

            if (current.type === 'INITIAL') {
                throw new BadRequestException('Эту транзакцию нельзя удалить')
            }

            await Promise.all(
                current.entries.map((entry) =>
                    this.assertAccountOwnership(tx, userId, entry.accountId),
                ),
            )

            await this.ledgerService.revert(tx, current.entries)
            await tx.transaction.delete({
                where: { id: transactionId },
            })

            return mapTransaction(current, current.entries)
        })
    }

    async getTransactions(userId: string, dto: GetTransactionsDto) {
        const {
            limit = 50,
            cursor,
            sortField = 'date',
            sortOrder = 'desc',
        } = dto

        // получаем все accountId пользователя
        const accountIds = await this.resolveUserAccounts(
            userId,
            dto.accountIds,
        )

        const where = this.buildTransactionFilter(accountIds, dto)
        const transactions = await this.prisma.transaction.findMany({
            where,
            orderBy: [{ [sortField]: sortOrder }, { createdAt: 'desc' }],
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            include: {
                entries: true,
            },
        })

        const hasNextPage = transactions.length > limit
        if (hasNextPage) transactions.pop()

        const nextCursor = hasNextPage
            ? transactions[transactions.length - 1].id
            : null

        return {
            data: transactions.map((transaction) =>
                mapTransaction(transaction, transaction.entries),
            ),
            hasNextPage,
            nextCursor,
        }
    }

    async getTransactionsSummary(userId: string, dto: GetTransactionsDto) {
        const accountIds = await this.resolveUserAccounts(
            userId,
            dto.accountIds,
        )

        const where = this.buildTransactionFilter(accountIds, dto)

        const [incomeAggregate, expenseAggregate] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: {
                    AND: [where, { type: TransactionType.INCOME }],
                },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: {
                    AND: [where, { type: TransactionType.EXPENSE }],
                },
                _sum: { amount: true },
            }),
        ])

        const incomeTotal = Math.abs(Number(incomeAggregate._sum.amount ?? 0))
        const expenseTotal = Math.abs(Number(expenseAggregate._sum.amount ?? 0))

        return {
            incomeTotal,
            expenseTotal,
            difference: incomeTotal - expenseTotal,
        }
    }

    async getTransactionsAnalytics(userId: string, dto: GetTransactionsDto) {
        const accountIds = await this.resolveUserAccounts(
            userId,
            dto.accountIds,
        )

        const where = this.buildTransactionFilter(accountIds, dto)
        const [transactions, accounts, funds] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
                include: {
                    entries: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                },
            }),
            this.prisma.account.findMany({
                where: {
                    userId,
                    id: { in: accountIds },
                },
                select: {
                    id: true,
                    name: true,
                    initialBalance: true,
                },
                orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
            }),
            this.prisma.fund.findMany({
                where: {
                    userId,
                    ...(dto.fundIds?.length ? { id: { in: dto.fundIds } } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    colorBg: true,
                },
                orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
            }),
        ])

        const accountMap = new Map(
            accounts.map((account) => [account.id, account]),
        )
        const fundMap = new Map(funds.map((fund) => [fund.id, fund]))

        const shouldIncludeEntry = (entry: {
            accountId: string
            fundId: string | null
        }) => {
            if (!accountIds.includes(entry.accountId)) {
                return false
            }

            if (dto.fundIds?.length) {
                return entry.fundId ? dto.fundIds.includes(entry.fundId) : false
            }

            return true
        }

        const overview = {
            incomeTotal: 0,
            expenseTotal: 0,
            transferTotal: 0,
            net: 0,
            transactionsCount: transactions.length,
            incomeCount: 0,
            expenseCount: 0,
            transferCount: 0,
            averageIncome: 0,
            averageExpense: 0,
            largestIncome: 0,
            largestExpense: 0,
        }

        const byDateMap = new Map<
            string,
            {
                date: string
                income: number
                expense: number
                transfer: number
                net: number
            }
        >()
        const byCategoryMap = new Map<
            string,
            {
                categoryId: string | null
                categoryName: string
                type: CategoryType
                amount: number
                count: number
                share: number
            }
        >()
        const byAccountMap = new Map<
            string,
            {
                accountId: string
                accountName: string
                initialBalance: number
                income: number
                expense: number
                transferIn: number
                transferOut: number
                net: number
                transactionCount: number
                transactionIds: Set<string>
            }
        >()
        const byFundMap = new Map<
            string,
            {
                fundId: string | null
                fundName: string
                colorBg: string | null
                income: number
                expense: number
                transferIn: number
                transferOut: number
                net: number
                transactionCount: number
                transactionIds: Set<string>
            }
        >()

        for (const transaction of transactions) {
            const amount = Math.abs(Number(transaction.amount))
            const dateKey = transaction.date.toISOString().slice(0, 10)
            const dayBucket = byDateMap.get(dateKey) ?? {
                date: dateKey,
                income: 0,
                expense: 0,
                transfer: 0,
                net: 0,
            }

            if (transaction.type === TransactionType.INCOME) {
                overview.incomeTotal += amount
                overview.incomeCount += 1
                overview.largestIncome = Math.max(
                    overview.largestIncome,
                    amount,
                )
                dayBucket.income += amount
            }

            if (transaction.type === TransactionType.EXPENSE) {
                overview.expenseTotal += amount
                overview.expenseCount += 1
                overview.largestExpense = Math.max(
                    overview.largestExpense,
                    amount,
                )
                dayBucket.expense += amount
            }

            if (transaction.type === TransactionType.TRANSFER) {
                overview.transferTotal += amount
                overview.transferCount += 1
                dayBucket.transfer += amount
            }

            if (
                transaction.category &&
                (transaction.type === TransactionType.INCOME ||
                    transaction.type === TransactionType.EXPENSE)
            ) {
                const categoryKey = `${transaction.category.type}:${transaction.category.id}`
                const currentCategory = byCategoryMap.get(categoryKey) ?? {
                    categoryId: transaction.category.id,
                    categoryName: transaction.category.name,
                    type: transaction.category.type,
                    amount: 0,
                    count: 0,
                    share: 0,
                }

                currentCategory.amount += amount
                currentCategory.count += 1
                byCategoryMap.set(categoryKey, currentCategory)
            }

            byDateMap.set(dateKey, dayBucket)

            const visibleEntries =
                transaction.entries.filter(shouldIncludeEntry)
            for (const entry of visibleEntries) {
                const numericAmount = Number(entry.amount)
                const account = accountMap.get(entry.accountId)
                if (account) {
                    const accountBucket = byAccountMap.get(entry.accountId) ?? {
                        accountId: entry.accountId,
                        accountName: account.name,
                        initialBalance: Number(account.initialBalance),
                        income: 0,
                        expense: 0,
                        transferIn: 0,
                        transferOut: 0,
                        net: 0,
                        transactionCount: 0,
                        transactionIds: new Set<string>(),
                    }

                    this.applyEntryToAnalyticsBucket(
                        accountBucket,
                        transaction.type,
                        numericAmount,
                    )
                    accountBucket.transactionIds.add(transaction.id)
                    byAccountMap.set(entry.accountId, accountBucket)
                }

                const fundKey = entry.fundId ?? 'no-fund'
                const fund = entry.fundId ? fundMap.get(entry.fundId) : null
                const fundBucket = byFundMap.get(fundKey) ?? {
                    fundId: entry.fundId,
                    fundName: fund?.name ?? 'Без фонда',
                    colorBg: fund?.colorBg ?? null,
                    income: 0,
                    expense: 0,
                    transferIn: 0,
                    transferOut: 0,
                    net: 0,
                    transactionCount: 0,
                    transactionIds: new Set<string>(),
                }

                this.applyEntryToAnalyticsBucket(
                    fundBucket,
                    transaction.type,
                    numericAmount,
                )
                fundBucket.transactionIds.add(transaction.id)
                byFundMap.set(fundKey, fundBucket)
            }
        }

        overview.net = overview.incomeTotal - overview.expenseTotal
        overview.averageIncome =
            overview.incomeCount > 0
                ? overview.incomeTotal / overview.incomeCount
                : 0
        overview.averageExpense =
            overview.expenseCount > 0
                ? overview.expenseTotal / overview.expenseCount
                : 0

        const byCategory = Array.from(byCategoryMap.values())
            .map((item) => {
                const totalByType =
                    item.type === CategoryType.INCOME
                        ? overview.incomeTotal
                        : overview.expenseTotal

                return {
                    ...item,
                    share:
                        totalByType > 0
                            ? Number(
                                  ((item.amount / totalByType) * 100).toFixed(
                                      2,
                                  ),
                              )
                            : 0,
                }
            })
            .sort((left, right) => right.amount - left.amount)

        const byAccount = Array.from(byAccountMap.values())
            .map(({ transactionIds, ...item }) => ({
                ...item,
                transactionCount: transactionIds.size,
            }))
            .sort((left, right) => Math.abs(right.net) - Math.abs(left.net))

        const byFund = Array.from(byFundMap.values())
            .map(({ transactionIds, ...item }) => ({
                ...item,
                transactionCount: transactionIds.size,
            }))
            .sort((left, right) => Math.abs(right.net) - Math.abs(left.net))

        const byDate = Array.from(byDateMap.values())
            .map((item) => ({
                ...item,
                net: item.income - item.expense,
            }))
            .sort((left, right) => left.date.localeCompare(right.date))

        return {
            overview,
            byCategory,
            byAccount,
            byFund,
            byDate,
        }
    }

    private calculateAmount(type: TransactionType, amount: number) {
        if (type === TransactionType.INITIAL) return amount
        return Math.abs(amount)
    }

    private applyEntryToAnalyticsBucket(
        bucket: {
            income: number
            expense: number
            transferIn: number
            transferOut: number
            net: number
        },
        type: TransactionType,
        amount: number,
    ) {
        if (type === TransactionType.TRANSFER) {
            if (amount >= 0) {
                bucket.transferIn += amount
            } else {
                bucket.transferOut += Math.abs(amount)
            }
        } else if (amount >= 0) {
            bucket.income += amount
        } else {
            bucket.expense += Math.abs(amount)
        }

        bucket.net += amount
    }

    private async assertAccountOwnership(tx: Tx, userId: string, id?: string) {
        if (!id) return

        const account = await tx.account.findUnique({
            where: {
                id_userId: { id, userId },
            },
        })

        if (!account) throw new ForbiddenException('Account not found')
    }

    private async assertFundOwnership(tx: Tx, userId: string, id?: string) {
        if (!id) return

        const fund = await tx.fund.findUnique({
            where: {
                id_userId: { id, userId },
            },
        })

        if (!fund) throw new ForbiddenException('Fund not found')
    }

    private async resolveUserAccounts(userId: string, accountIds?: string[]) {
        if (accountIds && accountIds.length > 0) {
            const accounts = await this.prisma.account.findMany({
                where: {
                    id: { in: accountIds },
                    userId: userId,
                },
            })

            if (accounts.length !== accountIds.length) {
                throw new ForbiddenException(
                    'Some accounts do not belong to user',
                )
            }

            return accounts.map((a) => a.id)
        }

        // Если accountIds не переданы — возвращаем все аккаунты пользователя
        const accounts = await this.prisma.account.findMany({
            where: { userId },
            select: { id: true },
        })

        return accounts.map((a) => a.id)
    }

    private buildTransactionFilter(
        accountIds: string[],
        dto: GetTransactionsDto,
    ): Prisma.TransactionWhereInput {
        const entryFilter: Prisma.LedgerEntryWhereInput = {
            accountId: { in: accountIds },
        }

        if (dto.fundIds) {
            entryFilter.fundId = { in: dto.fundIds }
        }

        const where: Prisma.TransactionWhereInput = {
            entries: {
                some: entryFilter,
            },
        }

        if (dto.dateFrom || dto.dateTo) {
            where.date = {}

            if (dto.dateFrom) {
                const fromDate = new Date(dto.dateFrom)
                fromDate.setHours(0, 0, 0, 0)
                where.date.gte = fromDate
            }
            if (dto.dateTo) {
                const toDate = new Date(dto.dateTo)
                toDate.setHours(23, 59, 59, 999)
                where.date.lte = toDate
            }
        }

        if (dto.categoryIds) where.categoryId = { in: dto.categoryIds }
        if (dto.transactionTypes) where.type = { in: dto.transactionTypes }

        return where
    }
}
