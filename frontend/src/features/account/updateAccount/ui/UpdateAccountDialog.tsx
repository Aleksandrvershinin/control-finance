import { useUpdateAccountDialogStore } from '../model/useUpdateAccountDialogStore'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { UpdateAccountForm } from './UpdateAccountForm'

export const UpdateAccountDialog = () => {
    const account = useUpdateAccountDialogStore((s) => s.account)
    const isOpen = !!account
    const close = useUpdateAccountDialogStore((s) => s.close)
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Редактировать счет
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    {account && <UpdateAccountForm account={account} />}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
