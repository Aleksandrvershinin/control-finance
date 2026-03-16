import { useUpdateCategoryDialogStore } from '../model/useUpdateCategoryDialogStore'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import { UpdateCategoryForm } from './UpdateCategoryForm'

export const UpdateCategoryDialog = () => {
    const { category, isOpen, close } = useUpdateCategoryDialogStore()

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Редактировать категорию
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    {category && <UpdateCategoryForm category={category} />}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
