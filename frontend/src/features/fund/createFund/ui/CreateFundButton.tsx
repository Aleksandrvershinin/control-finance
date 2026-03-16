import { Button } from '@/shared/ui'
import { useCreateFundDialogStore } from '../model/useCreateFundDialogStore'

export const CreateFundButton = () => {
    const open = useCreateFundDialogStore((s) => s.open)
    return (
        <Button variant="green" onClick={open}>
            Создать фонд
        </Button>
    )
}
