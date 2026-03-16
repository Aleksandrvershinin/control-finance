import {
    transactionsTypeMeta,
    TransactionTypeMeta,
} from './transactionTypeMeta.types'

export const getTransactionTypeMeta = (
    type: TransactionTypeMeta['type'],
): TransactionTypeMeta => {
    const typeMeta = transactionsTypeMeta.find(
        (typeMeta) => typeMeta.type === type,
    )
    if (!typeMeta) {
        throw new Error(`Transaction type "${type}" not found`)
    }
    return typeMeta
}
