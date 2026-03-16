import { useDeleteCategoryDialogStore } from '../model/useDeleteCategoryDialogStore'
import { useDeleteCategoryMutation } from '../model/useDeleteCategoryMutation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    LoadingButton,
} from '@/shared/ui'
import { toast } from '@/shared/hooks/use-toast'

export const DeleteCategoryDialog = () => {
    const { categoryId, isOpen, close } = useDeleteCategoryDialogStore()
    const { mutateAsync, isPending } = useDeleteCategoryMutation()

    const handleDelete = async () => {
        if (!categoryId) return

        try {
            await mutateAsync(categoryId)
            toast({
                variant: 'success',
                title: 'Категория успешно удалена',
            })
            close()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Ошибка при удалении категории',
            })
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить категорию</DialogTitle>
                    <DialogDescription>
                        Вы уверены, что хотите удалить эту категорию? Это
                        действие необратимо.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={close}>
                        Отмена
                    </Button>
                    <LoadingButton
                        loading={isPending}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Удалить
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
