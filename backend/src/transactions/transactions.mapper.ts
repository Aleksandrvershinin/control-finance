import { LedgerEntry, Transaction, TransactionType } from '@prisma/client'

export function mapTransaction(
    transaction: Transaction,
    entries: LedgerEntry[] = [],
) {
    if (transaction.type === TransactionType.TRANSFER) {
        const from = entries.find((e) => Number(e.amount) < 0)
        const to = entries.find((e) => Number(e.amount) > 0)

        return {
            id: transaction.id,
            type: transaction.type,
            categoryId: transaction.categoryId,
            description: transaction.description,
            date: transaction.date,
            accountId: from?.accountId ?? null,
            toAccountId: to?.accountId ?? null,
            fundId: from?.fundId ?? null,
            toFundId: to?.fundId ?? null,
            amount: Math.abs(Number(from?.amount ?? to?.amount ?? 0)),
        }
    }

    const entry = entries[0]

    return {
        id: transaction.id,
        type: transaction.type,
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transaction.date,
        accountId: entry?.accountId ?? null,
        toAccountId: null,
        fundId: entry?.fundId ?? null,
        toFundId: null,
        amount: Number(entry?.amount ?? 0),
    }
}
