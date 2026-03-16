import { getCategoryColumns } from './CategoriesColumns'
import { DataTable } from '@/shared/ui/DataTable'
import { useUpdateCategoryDialogStore } from '../../updateCategory'
import { useDeleteCategoryDialogStore } from '../../deleteCategory'
import { Category } from '@/entities/category'

interface Props {
    categories: Category[]
}

export function CategoriesTable({ categories }: Props) {
    const openEdit = useUpdateCategoryDialogStore((s) => s.open)
    const openDelete = useDeleteCategoryDialogStore((s) => s.open)

    const columns = getCategoryColumns({
        onDelete: openDelete,
        onEdit: openEdit,
    })

    return <DataTable columns={columns} data={categories} />
}
