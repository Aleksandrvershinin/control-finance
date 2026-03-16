import { Button } from '@/shared/ui'
import { useCreateCategoryDialogStore } from '../model/useCreateCategoryDialogStore'

export const CreateCategoryButton = () => {
    const open = useCreateCategoryDialogStore((s) => s.open)
    return (
        <Button variant="green" onClick={open}>
            Создать категорию
        </Button>
    )
}
