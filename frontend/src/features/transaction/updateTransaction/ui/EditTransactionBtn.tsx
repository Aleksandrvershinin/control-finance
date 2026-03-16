import { Transaction } from '@/entities/transaction'
import { useUpdateTransactionDialogStore } from '../model/useUpdateTransactionDialogStore'
import { EditButton, EditButtonProps } from '@/shared/ui'

interface Props extends EditButtonProps {
    transaction: Transaction
}

export function EditTransactionBtn({ transaction, ...rest }: Props) {
    const open = useUpdateTransactionDialogStore((s) => s.open)
    return <EditButton onClick={() => open(transaction)} {...rest}></EditButton>
}
