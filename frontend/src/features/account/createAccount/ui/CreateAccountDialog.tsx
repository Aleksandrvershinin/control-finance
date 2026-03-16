import { useCreateAccountDialogStore } from '../model/useCreateAccountDialogStore'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { CreateAccountForm } from './CreateAccountForm'

export const CreateAccountDialog = () => {
    const isOpen = useCreateAccountDialogStore((s) => s.isOpen)
    const close = useCreateAccountDialogStore((s) => s.close)
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Добавить счет
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <CreateAccountForm />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
