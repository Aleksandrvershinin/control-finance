'use client'
import { Button } from '@/shared/ui'
import { useCreateTransactionDialogStore } from '../model/useCreateTransactionDialogStore'
import { TRANSACTION_TYPES, TRANSFER_TYPES } from '@/entities/transaction'

export const TransactionFundCreateButton = () => {
    const open = useCreateTransactionDialogStore((s) => s.open)
    return (
        <>
            <Button
                onClick={() =>
                    open({
                        type: TRANSACTION_TYPES.TRANSFER,
                        transferType: TRANSFER_TYPES.FUNDS,
                    })
                }
                className="w-full"
                variant={'default'}
            >
                Перевод между фондами
            </Button>
        </>
    )
}
