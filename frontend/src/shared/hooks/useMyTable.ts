import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from '@tanstack/react-table'
import { useState } from 'react'

export function useMyTable<T>(
    data: T[],
    columns: ColumnDef<T, any>[],
) {
    const [sorting, setSorting] = useState<SortingState>([])

    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    })
}