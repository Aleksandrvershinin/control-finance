import { Button, LoadingButton, MyDialog } from '@/shared/ui'
import { toast } from '@/shared/hooks/use-toast'
import { useState } from 'react'
import { NormalizedError } from '@/shared/lib/errors/NormalizedError'
import { useDeleteTransactionDialogStore } from '../model/useDeleteTransactionDialogStore'
import { useDeleteTransactionMutation } from '../model/useDeleteTransactionMutation'

export const DeleteTransactionDialog = () => {
    const { clear, close, isOpen, transactionId } =
        useDeleteTransactionDialogStore()
    const { mutateAsync, isPending } = useDeleteTransactionMutation()
    const [error, setError] = useState<string | null>(null)

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            close()
            setError(null)
        }
    }
    const handleAnimationEnd = () => {
        if (!isOpen) {
            clear()
            setError(null)
        }
    }

    const handleDelete = async () => {
        if (!transactionId) return

        await mutateAsync(transactionId, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'транзакция удалена',
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
            onAnimationEnd={handleAnimationEnd}
            title={<>Подтвердить удаление</>}
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        Отмена
                    </Button>

                    <LoadingButton
                        loading={isPending}
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Удалить
                    </LoadingButton>
                </>
            }
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
        >
            <div className="py-4">
                <p className="text-sm text-[var(--neutral-600)]">
                    Вы уверены, что хотите удалить эту транзакцию? Это действие
                    невозможно отменить.
                </p>
                {error && (
                    <p className="text-sm text-[var(--error-600)] mt-3">
                        {error}
                    </p>
                )}
            </div>
        </MyDialog>
    )
}
