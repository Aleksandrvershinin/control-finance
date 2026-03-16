import { useCreateFundDialogStore } from '../model/useCreateFundDialogStore'
import { CreateFundForm } from './CreateFundForm'
import { MyDialog } from '@/shared/ui'

export const CreateFundDialog = () => {
    const isOpen = useCreateFundDialogStore((s) => s.isOpen)
    const close = useCreateFundDialogStore((s) => s.close)
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <MyDialog
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
            title={<>Добавить фонд</>}
        >
            <CreateFundForm />
        </MyDialog>
    )
}
