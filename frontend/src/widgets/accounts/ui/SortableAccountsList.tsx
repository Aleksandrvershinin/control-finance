import { Account } from '@/entities/account'
import {
    applyAccountOrder,
    SortableAccountItem,
    getReorderedAccountIdsFromDragEvent,
    useReorderAccountsMutation,
} from '@/features/account'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/shared/lib/utils'
import { AccountsListItem } from './AccountsListItem'
import { useEffect, useState } from 'react'

type SortableAccountsListProps = {
    accounts: Account[]
    isFetching: boolean
    currencyCode: string
    currencySymbol: string
}

export const SortableAccountsList = ({
    accounts,
    isFetching,
    currencyCode,
    currencySymbol,
}: SortableAccountsListProps) => {
    const reorderAccountsMutation = useReorderAccountsMutation()
    const [viewAccounts, setViewAccounts] = useState(accounts)

    useEffect(() => {
        setViewAccounts(accounts)
    }, [accounts])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const reorderedIds = getReorderedAccountIdsFromDragEvent(
            viewAccounts,
            event,
        )

        if (!reorderedIds) {
            return
        }

        setViewAccounts((prev) => applyAccountOrder(prev, reorderedIds))
        reorderAccountsMutation.mutate(reorderedIds)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={viewAccounts.map((account) => account.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul className={cn({ 'blur-sm': isFetching }, 'space-y-4')}>
                    {viewAccounts.map((account) => (
                        <SortableAccountItem id={account.id} key={account.id}>
                            <AccountsListItem
                                account={account}
                                currencyCode={currencyCode}
                                currencySymbol={currencySymbol}
                            />
                        </SortableAccountItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}
