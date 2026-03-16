import { DeleteButton } from '@/shared/ui'
import { useDeleteAccountDialogStore } from '../model/useDeleteAccountDialogStore'

export const DeleteAccountButton = ({
    id,
    name,
}: {
    id: string
    name: string
}) => {
    const open = useDeleteAccountDialogStore((s) => s.open)
    return (
        <DeleteButton title="Удалить счет" onClick={() => open({ id, name })} />
    )
}
