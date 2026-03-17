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
        accountId: string
        amount: number
        fundId?: string | null
        toAccountId?: string
        toFundId?: string | null
    }) {
        const entries: Prisma.LedgerEntryCreateInput[] = [
            {
                transaction: { connect: { id: transactionId } },
                account: { connect: { id: accountId } },
                fund: fundId ? { connect: { id: fundId } } : undefined,
                amount: this.calculateAmount(type, amount),
            },
        ]

        if (type === TransactionType.TRANSFER) {
            if (!toAccountId) {
                throw new BadRequestException(
                    'toAccountId is required for transfer transaction',
                )
            }
            entries.push({
                transaction: { connect: { id: transactionId } },
                account: { connect: { id: toAccountId } },
                fund: toFundId ? { connect: { id: toFundId } } : undefined,
                amount: Math.abs(amount),
            })
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
