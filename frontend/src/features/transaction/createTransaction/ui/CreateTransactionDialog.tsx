import { transactionsTypeMeta } from '@/entities/transaction'
import { useCreateTransactionDialogStore } from '@/features/transaction/createTransaction'
import { MyDialog } from '@/shared/ui'
import { CreateTransactionForm } from './CreateTransactionForm'

export const CreateTransactionDialog = () => {
    const { isOpen, config, close, clear } = useCreateTransactionDialogStore()

    const transaction = transactionsTypeMeta.find(
        (t) => t.type === config?.type,
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
                    <div>Создание новой транзакции</div>
                    {transaction && (
                        <div
                            style={{
                                color: `var(${transaction.color})`,
                            }}
                        >
                            {transaction.name}
                        </div>
                    )}
                </>
            }
        >
            <>{config && <CreateTransactionForm config={config} />}</>
        </MyDialog>
    )
}
