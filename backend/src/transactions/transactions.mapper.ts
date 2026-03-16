import { plainToInstance } from 'class-transformer'
import { ResponseTransactionDto } from './dto/response-transaction.dto'
import { LedgerEntry, Transaction, TransactionType } from '@prisma/client'

export function mapTransaction(
    transaction: Transaction,
    entries: LedgerEntry[],
) {
    let accountId: string | undefined
    let toAccountId: string | undefined | null
    let fundId: string | undefined | null
    let toFundId: string | undefined | null
    let amount = 0

    if (transaction.type === TransactionType.TRANSFER) {
        const from = entries.find((e) => Number(e.amount) < 0)
        const to = entries.find((e) => Number(e.amount) > 0)

        accountId = from?.accountId
        fundId = from?.fundId

        toAccountId = to?.accountId
        toFundId = to?.fundId

        amount = Math.abs(Number(from?.amount))
    } else {
        const entry = entries[0]

        accountId = entry.accountId
        fundId = entry.fundId
        amount = Number(entry.amount)
    }

    return {
        id: transaction.id,
        type: transaction.type,
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transaction.date,
        accountId,
        toAccountId,
        fundId,
        toFundId,
        amount,
    }
}
