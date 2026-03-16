import { useCreateCategoryDialogStore } from '../model/useCreateCategoryDialogStore'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { CreateCategoryForm } from './CreateCategoryForm'

export const CreateCategoryDialog = () => {
    const isOpen = useCreateCategoryDialogStore((s) => s.isOpen)
    const close = useCreateCategoryDialogStore((s) => s.close)
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Добавить категорию
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <CreateCategoryForm />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
