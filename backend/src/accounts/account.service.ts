import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { ReorderAccountsDto } from './dto/reorderAccounts.dto'
import { mapAccount } from './account.mapper'
import { TransactionsService } from 'src/transactions/transactions.service'

@Injectable()
export class AccountService {
    constructor(
        private prisma: PrismaService,
        private transactionService: TransactionsService,
    ) {}

    async create(userId: string, dto: CreateAccountDto) {
        const exists = await this.prisma.account.findFirst({
            where: { userId, name: dto.name },
        })

        if (exists) {
            throw new BadRequestException(
                'Счет с таким названием уже существует',
            )
        }

        return this.prisma.$transaction(async (tx) => {
            const account = await tx.account.create({
                data: {
                    name: dto.name,
                    order: dto.order,
                    initialBalance: Math.abs(dto.initialBalance),
                    userId,
                },
                include: {
                    accountFundBalances: {
                        include: { fund: true },
                    },
                    user: {
                        select: { currencyId: true },
                    },
                },
            })

            if (dto.initialBalance !== 0) {
                await this.transactionService.createTx(tx, userId, {
                    type: 'INITIAL',
                    amount: dto.initialBalance,
                    description: 'Начальный баланс',
                    date: new Date().toISOString(),
                    accountId: account.id,
                })
            }

            return mapAccount(account)
        })
    }

    async findAll(userId: string) {
        const accounts = await this.prisma.account.findMany({
            where: { userId },
            include: {
                accountFundBalances: {
                    include: { fund: true },
                    orderBy: [
                        { fund: { order: 'asc' } },
                        { fund: { createdAt: 'asc' } },
                    ],
                },
                user: {
                    select: { currencyId: true },
                },
            },
            orderBy: { order: 'asc' },
        })

        return accounts.map((account) => mapAccount(account))
    }

    async update(userId: string, accountId: string, dto: UpdateAccountDto) {
        const currentAccount = await this.ensureAccount(userId, accountId)

        if (dto.name && dto.name !== currentAccount.name) {
            const exists = await this.prisma.account.findFirst({
                where: {
                    userId,
                    name: dto.name,
                    NOT: { id: accountId },
                },
            })

            if (exists) {
                throw new BadRequestException(
                    'Счет с таким названием уже существует',
                )
            }
        }

        const hasUpdates = dto.name !== undefined || dto.order !== undefined

        if (!hasUpdates) {
            const account = await this.prisma.account.findUniqueOrThrow({
                where: { id: accountId },
                include: {
                    accountFundBalances: {
                        include: { fund: true },
                    },
                    user: {
                        select: { currencyId: true },
                    },
                },
            })

            return mapAccount(account)
        }

        const account = await this.prisma.account.update({
            where: { id: accountId },
            data: {
                ...(dto.name !== undefined ? { name: dto.name } : {}),
                ...(dto.order !== undefined ? { order: dto.order } : {}),
            },
            include: {
                accountFundBalances: {
                    include: { fund: true },
                },
                user: {
                    select: { currencyId: true },
                },
            },
        })

        return mapAccount(account)
    }

    async reorder(userId: string, dto: ReorderAccountsDto) {
        const accountIds = dto.items.map((item) => item.id)
        const uniqueAccountIds = new Set(accountIds)

        if (uniqueAccountIds.size !== accountIds.length) {
            throw new BadRequestException(
                'Duplicate account ids in reorder payload',
            )
        }

        const accounts = await this.prisma.account.findMany({
            where: {
                userId,
                id: { in: accountIds },
            },
            select: { id: true },
        })

        if (accounts.length !== accountIds.length) {
            throw new NotFoundException('Some accounts were not found')
        }

        await this.prisma.$transaction(
            dto.items.map((item) =>
                this.prisma.account.update({
                    where: { id: item.id },
                    data: { order: item.order },
                }),
            ),
        )

        return this.findAll(userId)
    }

    async remove(userId: string, accountId: string) {
        await this.ensureAccount(userId, accountId)

        const account = await this.prisma.account.delete({
            where: { id: accountId },
            include: {
                accountFundBalances: {
                    include: { fund: true },
                },
                user: {
                    select: { currencyId: true },
                },
            },
        })

        return mapAccount(account)
    }
    private async ensureAccount(userId: string, accountId: string) {
        const account = await this.prisma.account.findFirst({
            where: {
                id: accountId,
                userId,
            },
        })

        if (!account) {
            throw new NotFoundException('Account not found')
        }

        return account
    }

    private async getRequiredCurrency(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { currency: true },
        })

        if (!user?.currency) {
            throw new InternalServerErrorException(
                'User currency is not configured',
            )
        }

        return user.currency
    }
}
