import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from 'lucide-react'
import {
    CreateTransactionConfig,
    useCreateTransactionDialogStore,
} from '../model/useCreateTransactionDialogStore'
const config = {
    INCOME: {
        color: 'var(--success-500)',
        icon: ArrowDownIcon,
        title: 'Доход',
    },
    EXPENSE: {
        color: 'var(--error-500)',
        icon: ArrowUpIcon,
        title: 'Расход',
    },
    TRANSFER: {
        color: 'var(--transfer-color)',
        icon: ArrowRightIcon,
        title: 'Перевод',
    },
} as const

export const TransactionCreateButton = ({
    accountId,
    action,
}: {
    action: CreateTransactionConfig['type']
    accountId: string
}) => {
    const open = useCreateTransactionDialogStore((s) => s.open)
    const currentConfig = config[action]
    return (
        <>
            <button
                onClick={() => open({ accountId, type: action })}
                style={{ backgroundColor: currentConfig.color }}
                className={`p-1 rounded-full`}
                title={currentConfig.title}
            >
                {<currentConfig.icon color="white" size={20} />}
            </button>
        </>
    )
}
