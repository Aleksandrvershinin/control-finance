import { useUpdateFundDialogStore } from '../model/useUpdateFundDialogStore'
import { UpdateFundForm } from './UpdateFundForm'
import { MyDialog } from '@/shared/ui'

export const UpdateFundDialog = () => {
    const { fund, isOpen, close } = useUpdateFundDialogStore()

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) close()
    }

    return (
        <MyDialog
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
            title={<>Редактировать фонд</>}
        >
            {fund && <UpdateFundForm fund={fund} />}
        </MyDialog>
    )
}
