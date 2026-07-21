import {
    TRANSACTION_TYPES,
    TransactionDialogForm,
    transactionsTypeMeta,
    TRANSFER_TYPES,
} from '@/entities/transaction'
import { useCreateTransactionDialogStore } from '@/features/transaction/createTransaction'
import { CreateIncomeExpenseForm } from './CreateIncomeExpenseForm'
import { CreateTransferForm } from './CreateTransferForm'
import { CreateTransferFundForm } from './CreateTransferFundForm'

export const CreateTransactionDialog = () => {
    const { isOpen, config, close, clear } = useCreateTransactionDialogStore()

    const transaction = transactionsTypeMeta.find(
        (t) => t.type === config?.type,
    )
    const isIncomeOrExpense =
        config?.type === TRANSACTION_TYPES.EXPENSE ||
        config?.type === TRANSACTION_TYPES.INCOME
    const isFundTransfer =
        config?.type === TRANSACTION_TYPES.TRANSFER &&
        config?.transferType === TRANSFER_TYPES.FUNDS
    return (
        <TransactionDialogForm
            onOpenChange={(open) => {
                if (!open) close()
            }}
            isOpen={isOpen}
            callBack={() => {
                if (!isOpen) {
                    clear()
                }
            }}
            title={
                <>
                    <div>Создание новой транзакции</div>
                    {transaction && (
                        <div
                            datatype={transaction.color}
                            style={{
                                color: `${transaction.color}`,
                            }}
                        >
                            {transaction.name}
                        </div>
                    )}
                </>
            }
        >
            <>
                {config && (
                    <>
                        {isIncomeOrExpense && (
                            <CreateIncomeExpenseForm config={config} />
                        )}
                        {config.type === TRANSACTION_TYPES.TRANSFER &&
                            (isFundTransfer ? (
                                <CreateTransferFundForm />
                            ) : (
                                <CreateTransferForm config={config} />
                            ))}
                    </>
                )}
            </>
        </TransactionDialogForm>
    )
}
