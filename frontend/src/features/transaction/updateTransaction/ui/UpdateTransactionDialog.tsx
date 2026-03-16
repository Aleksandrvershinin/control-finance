import { MyDialog } from '@/shared/ui'
import { UpdateTransactionForm } from './UpdateTransactionForm'
import { useUpdateTransactionDialogStore } from '../model/useUpdateTransactionDialogStore'
import { transactionsTypeMeta } from '@/entities/transaction'

export const UpdateTransactionDialog = () => {
    const { isOpen, transaction, close, clear } =
        useUpdateTransactionDialogStore()

    const transactionTypeMeta = transactionsTypeMeta.find(
        (t) => t.type === transaction?.type,
    )
    return (
        <MyDialog
            isOpen={isOpen}
            handleOpenChange={(open) => {
                if (!open) close()
            }}
            onAnimationEnd={() => {
                if (!isOpen) {
                    clear()
                }
            }}
            title={
                <>
                    <div>Редактирование транзакции</div>
                    {transactionTypeMeta && (
                        <div
                            style={{
                                color: `var(${transactionTypeMeta.color})`,
                            }}
                        >
                            {transactionTypeMeta.name}
                        </div>
                    )}
                </>
            }
        >
            <>
                {transaction && (
                    <UpdateTransactionForm transaction={transaction} />
                )}
            </>
        </MyDialog>
    )
}
