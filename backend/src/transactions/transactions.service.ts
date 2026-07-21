import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { GetTransactionsDto } from './dto/get-transactions.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Prisma, TransactionType } from '@prisma/client'
import { LedgerService } from 'src/ledger/ledger.service'
import { mapTransaction } from './transactions.mapper'
import { transactionFilters } from './transaction.filter'
import { AccountService } from 'src/accounts/account.service'
import { FundsService } from 'src/funds/funds.service'

type Tx = Prisma.TransactionClient

@Injectable()
export class TransactionsService {
    constructor(
        private prisma: PrismaService,
        private ledgerService: LedgerService,
        @Inject(forwardRef(() => AccountService))
        private accountService: AccountService,
        private fundService: FundsService,
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
            accountId?: string
            toAccountId?: string
        },
    ) {
        const accountIds = [dto.accountId, dto.toAccountId].filter(
            (id) => id !== undefined,
        )
        const fundIds = [dto.fundId, dto.toFundId].filter(
            (id) => id !== undefined,
        )
        const [accounts, funds] = await Promise.all([
            this.accountService.getUserAccounts(tx, userId, accountIds),
            this.fundService.getUserFunds(tx, userId, fundIds),
        ])
        if (accounts.length !== accountIds.length) {
            throw new NotFoundException('Account not found')
        }

        if (funds.length !== fundIds.length) {
            throw new NotFoundException('Fund not found')
        }
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
            const current = await this.getUserTransaction(
                tx,
                userId,
                transactionId,
            )

            const mappedCurrent = mapTransaction(current, current.entries)

            const amount = this.calculateAmount(
                current.type,
                dto.amount ?? mappedCurrent.amount,
            )

            const transaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    amount,
                    description: dto.description ?? current.description,
                    date: dto.date ? new Date(dto.date) : current.date,
                },
            })

            await this.ledgerService.revert(tx, current.entries)

            const createdEntries = await this.ledgerService.createLedgerEntries(
                {
                    prisma: tx,
                    transactionId,
                    type: current.type,
                    accountId: mappedCurrent.accountId,
                    fundId: mappedCurrent.fundId,
                    toAccountId: mappedCurrent.toAccountId ?? undefined,
                    toFundId: mappedCurrent.toFundId,
                    amount,
                },
            )

            return mapTransaction(transaction, createdEntries)
        })
    }

    async remove(userId: string, transactionId: string) {
        return this.prisma.$transaction(async (tx) => {
            const current = await this.getUserTransaction(
                tx,
                userId,
                transactionId,
            )

            if (current.type === 'INITIAL') {
                throw new BadRequestException('Эту транзакцию нельзя удалить')
            }

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

        const where: Prisma.TransactionWhereInput = {
            AND: [
                this.getUserTransactionsWhere(userId),
                ...transactionFilters.build(dto),
            ],
        }
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
        const where: Prisma.TransactionWhereInput = {
            AND: [
                this.getUserTransactionsWhere(userId),
                ...transactionFilters.build(dto),
            ],
        }

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

    private calculateAmount(type: TransactionType, amount: number) {
        if (type === TransactionType.INITIAL) return amount
        return Math.abs(amount)
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

    private async getUserTransaction(
        tx: Tx,
        userId: string,
        transactionId: string,
    ) {
        const transaction = await tx.transaction.findFirst({
            where: {
                id: transactionId,
                ...this.getUserTransactionsWhere(userId),
            },
            include: {
                entries: true,
            },
        })

        if (!transaction) {
            throw new NotFoundException('Transaction not found')
        }

        return transaction
    }
    private getUserTransactionsWhere(
        userId: string,
    ): Prisma.TransactionWhereInput {
        return {
            entries: {
                some: {
                    OR: [
                        {
                            account: {
                                userId,
                            },
                        },
                        {
                            fund: {
                                userId,
                            },
                        },
                    ],
                },
            },
        }
    }
}
