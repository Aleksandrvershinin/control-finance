import { ColumnDef } from '@tanstack/react-table'
import { Category } from '@/entities/category'
import {
    Stack,
    DataTableColumnHeader,
    DeleteButton,
    EditButton,
} from '@/shared/ui'

interface Props {
    onDelete: (id: string) => void
    onEdit: (category: Category) => void
}

export const getCategoryColumns = ({
    onDelete,
    onEdit,
}: Props): ColumnDef<Category>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Название" />
        ),
    },

    {
        id: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Тип" />
        ),
        accessorFn: (row) => row.typeName,
        cell: ({ row }) => {
            const category = row.original

            return (
                <Stack
                    className="font-semibold"
                    style={{ color: category.color }}
                >
                    <div>{category.typeName}</div>
                    <div>{category.icon}</div>
                </Stack>
            )
        },
    },

    {
        id: 'actions',
        header: 'Действия',

        cell: ({ row }) => {
            const category = row.original

            return (
                <div className="space-x-2">
                    <EditButton onClick={() => onEdit(category)} />

                    <DeleteButton onClick={() => onDelete(category.id)} />
                </div>
            )
        },
    },
]
