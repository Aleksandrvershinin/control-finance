import {
    transactionsTypeMeta,
    TransactionTypeMetaMultiSelect,
} from '@/entities/transaction'
import { useMainFilterStore } from '@/features/mainFilter'

export const TransactionTypeFilterSection = () => {
    const { setFilter, filters } = useMainFilterStore()

    return (
        <TransactionTypeMetaMultiSelect
            isClearable={true}
            onChange={(value) => setFilter('transactionTypes', value)}
            value={filters.transactionTypes ?? []}
            options={transactionsTypeMeta.map((acc) => ({
                label: acc.name,
                value: acc.id,
            }))}
        />
    )
}
