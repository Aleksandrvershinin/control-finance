import { Button } from '@/shared/ui'
import { useCreateAccountDialogStore } from '../model/useCreateAccountDialogStore'

export const CreateAccountButton = () => {
    const open = useCreateAccountDialogStore((s) => s.open)
    return (
        <Button variant={'green'} onClick={open}>
            Создать счет
        </Button>
    )
}
