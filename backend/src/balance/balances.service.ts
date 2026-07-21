import { Injectable } from '@nestjs/common'
import { LedgerEntry, Prisma } from '@prisma/client'

@Injectable()
export class BalancesService {
    async applyEntry(
        tx: Prisma.TransactionClient,
        entry: Pick<LedgerEntry, 'accountId' | 'fundId' | 'amount'>,
    ) {
        // Обновляем общий баланс счета
        if (entry.accountId) {
            await tx.accountBalance.upsert({
                where: { accountId: entry.accountId },
                update: { balance: { increment: entry.amount } },
                create: { accountId: entry.accountId, balance: entry.amount },
            })
        }

        // Обновляем общий баланс фонда (если он указан)
        if (entry.fundId) {
            await tx.fundBalance.upsert({
                where: { fundId: entry.fundId },
                update: { balance: { increment: entry.amount } },
                create: { fundId: entry.fundId, balance: entry.amount },
            })
        }
    }
}
