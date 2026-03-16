'use client'

import { Column } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface Props<T> {
    column: Column<T, any>
    title: string
}

export function DataTableColumnHeader<T>({ column, title }: Props<T>) {
    const sorted = column.getIsSorted()

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === 'asc')}
        >
            {title}

            {sorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
            {sorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
            {!sorted && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
    )
}
