import { CreateCategoryDialog } from './createCategory'
import { UpdateCategoryDialog } from './updateCategory'
import { DeleteCategoryDialog } from './deleteCategory'

export const CategoryDialogs = () => {
    return (
        <>
            <CreateCategoryDialog />
            <UpdateCategoryDialog />
            <DeleteCategoryDialog />
        </>
    )
}
