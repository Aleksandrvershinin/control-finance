import { useDeleteAccountDialogStore } from '../model/useDeleteAccountDialogStore'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    LoadingButton,
    DialogDescription,
} from '@/shared/ui'
import { useDeleteAccountMutation } from '../model/useDeleteAccountMutation'
import { toast } from '@/shared/hooks/use-toast'
import { NormalizedError } from '@/shared/lib/errors/NormalizedError'

export const DeleteAccountDialog = () => {
    const data = useDeleteAccountDialogStore((s) => s.data)
    const close = useDeleteAccountDialogStore((s) => s.close)
    const { mutateAsync, isPending } = useDeleteAccountMutation()
    const isOpen = !!data

    const handleDelete = async () => {
        if (data) {
            await mutateAsync(data.id, {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Счет успешно удален',
                    })
                },
                onError(error) {
                    if (error instanceof NormalizedError) {
                        toast({
                            variant: 'destructive',
                            title: error.message,
                        })
                    }
                },
            })
            close()
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить счет {data?.name}?</DialogTitle>
                    <DialogDescription>
                        Это действие необратимо. Счет будет удален навсегда.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <LoadingButton
                        variant="destructive"
                        loading={isPending}
                        onClick={handleDelete}
                    >
                        Удалить
                    </LoadingButton>

                    <Button variant="outline" onClick={close}>
                        Отмена
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
