import { Edit } from 'lucide-react'
import { useUpdateAccountDialogStore } from '../model/useUpdateAccountDialogStore'
import { Account } from '@/entities/account'

export const EditAccountButton = ({ account }: { account: Account }) => {
    const open = useUpdateAccountDialogStore((s) => s.open)
    return (
        <button onClick={() => open(account)} title="Редактировать счет">
            <Edit className="text-[var(--primary-500)]" size={23} />
        </button>
    )
}
