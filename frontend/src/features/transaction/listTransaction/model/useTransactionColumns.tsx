import { useGetAccountById } from '@/entities/account'
import { useGetCategoryById } from '@/entities/category'
import { useGetCurrencyById } from '@/entities/currency'
import { useGetFundById } from '@/entities/fund'
import { getTransactionTypeMeta, Transaction } from '@/entities/transaction'
import { formatCurrency } from '@/shared/lib/utils/formatCurrency'
import { DeleteButton } from '@/shared/ui'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { useDeleteTransactionDialogStore } from '../../deleteTransaction'
import { EditTransactionBtn } from '../../updateTransaction'

type SortProps = {
    field: 'date' | 'amount' | 'description'
    direction: 'asc' | 'desc'
}

type Options = {
    sort?: SortProps
    onSortChange?: (
        field: SortProps['field'],
        direction: SortProps['direction'],
    ) => void
}

const getSortIcon = (
    sort: SortProps | undefined,
    field: SortProps['field'],
) => {
    if (sort?.field === field) {
        return sort.direction === 'asc' ? (
            <ArrowUp className="inline-block ml-1 w-4 h-4 text-blue-500" />
        ) : (
            <ArrowDown className="inline-block ml-1 w-4 h-4 text-blue-500" />
        )
    }

    return <ArrowUpDown className="inline-block ml-1 w-4 h-4 text-gray-400" />
}

const getNextSortDirection = (
    sort: SortProps | undefined,
    field: SortProps['field'],
): SortProps['direction'] => {
    if (sort?.field === field) {
        return sort.direction === 'asc' ? 'desc' : 'asc'
    }

    return 'asc'
}

const createSortableHeaderRenderer = (
    sort: SortProps | undefined,
    onSortChange: Options['onSortChange'],
) => {
    return (label: string, field: SortProps['field']) => {
        const icon = getSortIcon(sort, field)
        const highlight =
            sort?.field === field ? 'bg-blue-50 font-semibold' : ''

        const handleClick = () => {
            if (!onSortChange) return
            onSortChange(field, getNextSortDirection(sort, field))
        }

        return (
            <div
                className={`flex items-center cursor-pointer select-none ${highlight} p-2 rounded`}
                onClick={handleClick}
            >
                {label}
                {icon}
            </div>
        )
    }
}

const renderEntityName = (getter: (id: string) => any, id?: string | null) =>
    id ? (getter(id)?.name ?? '-') : '-'

const createIndexColumn = (): ColumnDef<Transaction> => ({
    id: 'index',
    header: '№',
    cell: (info) => info.row.index + 1,
    size: 40,
    enableSorting: false,
})

const createDateColumn = (
    renderHeader: (label: string, field: SortProps['field']) => JSX.Element,
): ColumnDef<Transaction> => ({
    accessorKey: 'date',
    header: () => renderHeader('Дата', 'date'),
    cell: (info) => {
        const value = info.getValue()
        return typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : ''
    },
})

const createTypeColumn = (): ColumnDef<Transaction> => ({
    accessorKey: 'type',
    header: 'Тип транзакции',
    cell: (info) => {
        const type = info.row.original.type
        const typeMeta = getTransactionTypeMeta(type)
        return (
            <div className="font-semibold" style={{ color: typeMeta.color }}>
                {typeMeta.icon} {typeMeta.name}
            </div>
        )
    },
})

const createRelationColumn = (
    id: string,
    header: string,
    getter: (id: string) => any,
    valueGetter: (transaction: Transaction) => string | null | undefined,
): ColumnDef<Transaction> => ({
    id,
    header,
    cell: (info) => renderEntityName(getter, valueGetter(info.row.original)),
})

const createDescriptionColumn = (
    renderHeader: (label: string, field: SortProps['field']) => JSX.Element,
): ColumnDef<Transaction> => ({
    accessorKey: 'description',
    header: () => renderHeader('Описание', 'description'),
    cell: (info) => info.getValue() || '-',
})

const createAmountColumn = (
    renderHeader: (label: string, field: SortProps['field']) => JSX.Element,
    getAccountById: ReturnType<typeof useGetAccountById>,
    getCurrencyById: ReturnType<typeof useGetCurrencyById>,
): ColumnDef<Transaction> => ({
    id: 'amount',
    header: () => renderHeader('Сумма', 'amount'),
    cell: (info) => {
        const account = getAccountById(info.row.original.accountId)
        const currency = getCurrencyById(account?.currencyId)
        return (
            <div className="font-semibold">
                {formatCurrency(info.row.original.amount, currency?.code)}
            </div>
        )
    },
})

export const useTransactionColumns = ({
    sort,
    onSortChange,
}: Options = {}): ColumnDef<Transaction>[] => {
    const getCurrencyById = useGetCurrencyById()
    const getAccountById = useGetAccountById()
    const getFundById = useGetFundById()
    const getCategoryById = useGetCategoryById()
    const openDelete = useDeleteTransactionDialogStore((s) => s.open)
    const renderHeader = createSortableHeaderRenderer(sort, onSortChange)

    return [
        createIndexColumn(),
        createDateColumn(renderHeader),
        createTypeColumn(),
        createRelationColumn(
            'account',
            'Счет',
            getAccountById,
            (transaction) => transaction.accountId,
        ),
        createRelationColumn(
            'toAccount',
            'Куда (счет)',
            getAccountById,
            (transaction) => transaction.toAccountId,
        ),
        createRelationColumn(
            'fund',
            'Фонд',
            getFundById,
            (transaction) => transaction.fundId,
        ),
        createRelationColumn(
            'toFund',
            'Куда (фонд)',
            getFundById,
            (transaction) => transaction.toFundId,
        ),
        createRelationColumn(
            'category',
            'Категория',
            getCategoryById,
            (transaction) => transaction.categoryId,
        ),
        createDescriptionColumn(renderHeader),
        createAmountColumn(renderHeader, getAccountById, getCurrencyById),
        {
            id: 'actions',
            header: 'Действия',

            cell: ({ row }) => {
                const transaction = row.original

                return (
                    <div className="space-x-2">
                        <EditTransactionBtn
                            title="Редактировать транзакцию"
                            transaction={transaction}
                        />
                        <DeleteButton
                            title="Удалить транзакцию"
                            onClick={() => openDelete(transaction.id)}
                        />
                    </div>
                )
            },
        },
    ]
}
