import { Injectable } from '@nestjs/common'
import { LedgerEntry, Prisma } from '@prisma/client'

@Injectable()
export class BalancesService {
    async revert(
        prisma: Prisma.TransactionClient,
        entry: Pick<LedgerEntry, 'accountId' | 'fundId' | 'amount'>,
    ) {
        await this.applyEntry(prisma, {
            accountId: entry.accountId,
            fundId: entry.fundId,
            amount: new Prisma.Decimal(entry.amount).mul(-1),
        })
    }

    async applyEntry(
        tx: Prisma.TransactionClient,
        entry: Pick<LedgerEntry, 'accountId' | 'fundId' | 'amount'>,
    ) {
        const updated = await tx.accountFundBalance.updateMany({
            where: entry.fundId
                ? {
                      accountId: entry.accountId,
                      fundId: entry.fundId,
                  }
                : {
                      accountId: entry.accountId,
                      fund: { is: null },
                  },
            data: { balance: { increment: entry.amount } },
        })

        if (updated.count === 0) {
            await tx.accountFundBalance.create({
                data: {
                    accountId: entry.accountId,
                    balance: entry.amount,
                    ...(entry.fundId ? { fundId: entry.fundId } : {}),
                },
            })
        }
    }
}
