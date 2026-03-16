import { useDeleteFundDialogStore } from '../model/useDeleteFundDialogStore'
import { useDeleteFundMutation } from '../model/useDeleteFundMutation'
import { Button, LoadingButton, MyDialog } from '@/shared/ui'
import { toast } from '@/shared/hooks/use-toast'
import { useState } from 'react'
import { NormalizedError } from '@/shared/lib/errors/NormalizedError'

export const DeleteFundDialog = () => {
    const { fundId, isOpen, close } = useDeleteFundDialogStore()
    const { mutateAsync, isPending } = useDeleteFundMutation()
    const [error, setError] = useState<string | null>(null)

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            close()
            setError(null)
        }
    }

    const handleDelete = async () => {
        if (!fundId) return

        await mutateAsync(fundId, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Фонд удалён успешно',
                })
                close()
                setError(null)
            },
            onError: (error) => {
                let errorMessage = 'Неизвестная ошибка'
                if (error instanceof NormalizedError) {
                    errorMessage = error.message
                }
                setError(errorMessage)
                toast({
                    variant: 'destructive',
                    title: errorMessage,
                })
            },
        })
    }

    return (
        <MyDialog
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
            title={<>Удалить фонд</>}
        >
            <div className="space-y-4">
                <p>Вы уверены, что хотите удалить этот фонд?</p>
                {error && (
                    <p className="text-[var(--error-500)] text-sm">{error}</p>
                )}
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={close}>
                        Отмена
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={handleDelete}
                        loading={isPending}
                    >
                        Удалить
                    </LoadingButton>
                </div>
            </div>
        </MyDialog>
    )
}
