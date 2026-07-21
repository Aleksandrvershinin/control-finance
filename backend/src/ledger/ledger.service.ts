import { BadRequestException, Injectable } from '@nestjs/common'
import { LedgerEntry, Prisma, TransactionType } from '@prisma/client'
import { BalancesService } from 'src/balance/balances.service'

@Injectable()
export class LedgerService {
    constructor(private balancesService: BalancesService) {}

    async revert(prisma: Prisma.TransactionClient, entries: LedgerEntry[]) {
        for (const entry of entries) {
            await this.balancesService.applyEntry(prisma, {
                accountId: entry.accountId,
                fundId: entry.fundId,
                amount: new Prisma.Decimal(entry.amount).mul(-1),
            })
        }
        if (entries.length > 0) {
            await prisma.ledgerEntry.deleteMany({
                where: {
                    transactionId: entries[0].transactionId,
                },
            })
        }
    }

    async createLedgerEntries({
        prisma,
        transactionId,
        type,
        accountId,
        amount,
        fundId,
        toAccountId,
        toFundId,
    }: {
        prisma: Prisma.TransactionClient
        transactionId: string
        type: TransactionType
        accountId?: string | null
        amount: number
        fundId?: string | null
        toAccountId?: string
        toFundId?: string | null
    }) {
        if (type === TransactionType.TRANSFER) {
            // Для перевода между счетами оба счета обязательны
            if ((accountId && !toAccountId) || (!accountId && toAccountId)) {
                throw new BadRequestException(
                    'Both accountId and toAccountId must be provided for account transfer',
                )
            }

            // Должен быть хотя бы один источник/назначение
            if (!accountId && !fundId && !toFundId) {
                throw new BadRequestException(
                    'TRANSFER requires accounts or funds',
                )
            }
        }

        const entries: Prisma.LedgerEntryCreateInput[] = []

        // Исходная проводка
        const fromEntry: Prisma.LedgerEntryCreateInput = {
            transaction: {
                connect: {
                    id: transactionId,
                },
            },
            amount: this.calculateAmount(type, amount),
        }

        if (accountId) {
            fromEntry.account = {
                connect: {
                    id: accountId,
                },
            }
        }

        if (fundId) {
            fromEntry.fund = {
                connect: {
                    id: fundId,
                },
            }
        }

        if (fromEntry.account || fromEntry.fund) {
            entries.push(fromEntry)
        }

        // Проводка назначения
        if (type === TransactionType.TRANSFER) {
            const toEntry: Prisma.LedgerEntryCreateInput = {
                transaction: {
                    connect: {
                        id: transactionId,
                    },
                },
                amount: Math.abs(amount),
            }

            if (toAccountId) {
                toEntry.account = {
                    connect: {
                        id: toAccountId,
                    },
                }
            }

            if (toFundId) {
                toEntry.fund = {
                    connect: {
                        id: toFundId,
                    },
                }
            }

            if (toEntry.account || toEntry.fund) {
                entries.push(toEntry)
            }
        }

        if (entries.length === 0) {
            throw new BadRequestException('No ledger entries to create')
        }

        const created: LedgerEntry[] = []

        for (const entry of entries) {
            const e = await prisma.ledgerEntry.create({
                data: entry,
            })

            created.push(e)
        }

        for (const entry of created) {
            await this.balancesService.applyEntry(prisma, entry)
        }

        return created
    }

    private calculateAmount(type: TransactionType, amount: number): number {
        switch (type) {
            case TransactionType.INITIAL:
                return amount // оставляем как есть
            case TransactionType.EXPENSE:
                return -Math.abs(amount) // списание всегда -
            case TransactionType.INCOME:
                return Math.abs(amount) // поступление всегда +
            case TransactionType.TRANSFER:
                return -Math.abs(amount) // перевод -
            default:
                throw Error('Transaction type is wrong')
        }
    }
}
