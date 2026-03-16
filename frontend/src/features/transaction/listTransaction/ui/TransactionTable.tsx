import { Transaction } from '@/entities/transaction'
import { DataTable } from '@/shared/ui'
import { useTransactionColumns } from '../model/useTransactionColumns'

export const TransactionTable = ({
    transactions,
    sortField,
    sortOrder,
    onSortChange,
}: {
    transactions: Transaction[]
    sortField?: 'date' | 'amount' | 'description'
    sortOrder?: 'asc' | 'desc'
    onSortChange?: (field: 'date' | 'amount' | 'description') => void
}) => {
    const columns = useTransactionColumns({
        sort:
            sortField && sortOrder
                ? { field: sortField, direction: sortOrder }
                : undefined,
        onSortChange: (field) => onSortChange?.(field),
    })

    return <DataTable columns={columns} data={transactions} />
}
