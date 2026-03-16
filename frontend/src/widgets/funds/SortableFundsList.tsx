import { FundCard, FundType } from '@/entities/fund'
import {
    applyFundOrder,
    getReorderedFundIdsFromDragEvent,
    SortableFundItem,
    useReorderFundsMutation,
} from '@/features/fund'
import { cn } from '@/shared/lib/utils'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

type SortableFundsListProps = {
    funds: FundType[]
    isFetching: boolean
    getCurrencyCode: (currencyId: string) => string
}

export const SortableFundsList = ({
    funds,
    isFetching,
    getCurrencyCode,
}: SortableFundsListProps) => {
    const reorderFundsMutation = useReorderFundsMutation()
    const [viewFunds, setViewFunds] = useState(funds)

    useEffect(() => {
        setViewFunds(funds)
    }, [funds])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const reorderedIds = getReorderedFundIdsFromDragEvent(viewFunds, event)

        if (!reorderedIds) {
            return
        }

        setViewFunds((prev) => applyFundOrder(prev, reorderedIds))
        reorderFundsMutation.mutate(reorderedIds)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={viewFunds.map((fund) => fund.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul className={cn({ 'blur-sm': isFetching }, 'space-y-2')}>
                    {viewFunds.map((fund) => (
                        <SortableFundItem id={fund.id} key={fund.id}>
                            <FundCard
                                className="pt-5"
                                name={fund.name}
                                balance={fund.amount}
                                color={fund.colorBg}
                                currencyCode={getCurrencyCode(fund.currencyId)}
                            />
                        </SortableFundItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}
