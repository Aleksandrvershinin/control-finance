import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui'
import { useChangePasswordDialogStore } from '../model/useChangePasswordDialogStore'
import { ChangePasswordForm } from './ChangePasswordForm'

export const ChangePasswordDialog = () => {
    const isOpen = useChangePasswordDialogStore((s) => s.isOpen)
    const close = useChangePasswordDialogStore((s) => s.close)

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            close()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Сменить пароль
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <ChangePasswordForm />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
