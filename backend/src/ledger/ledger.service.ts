import { Injectable } from '@nestjs/common'
import { LedgerEntry, Prisma } from '@prisma/client'
import { BalancesService } from 'src/balance/balances.service'

@Injectable()
export class LedgerService {
    constructor(private balancesService: BalancesService) {}

    async revertEntries(
        prisma: Prisma.TransactionClient,
        entries: Pick<LedgerEntry, 'accountId' | 'fundId' | 'amount'>[],
    ) {
        for (const entry of entries) {
            await this.balancesService.applyEntry(prisma, {
                accountId: entry.accountId,
                fundId: entry.fundId,
                amount: new Prisma.Decimal(entry.amount).mul(-1),
            })
        }
    }

    async createEntries(
        prisma: Prisma.TransactionClient,
        entries: {
            transactionId: string
            accountId: string
            fundId?: string
            amount: number
        }[],
    ) {
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
}
