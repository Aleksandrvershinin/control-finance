import { TRANSACTION_TYPES, transactionsTypeMeta } from './constants'

export const getTransactionTypeMeta = (
    type: (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES],
) => {
    const typeMeta = transactionsTypeMeta.find(
        (typeMeta) => typeMeta.type === type,
    )
    if (!typeMeta) {
        throw new Error(`Transaction type "${type}" not found`)
    }
    return typeMeta
}
