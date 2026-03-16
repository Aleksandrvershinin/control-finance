import { FundType, ReorderFundsDto } from '@/entities/fund'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const toStringId = (id: DragEndEvent['active']['id']) => String(id)

export const getReorderedFundIdsFromDragEvent = (
    funds: FundType[],
    event: DragEndEvent,
): string[] | null => {
    const { active, over } = event

    if (!over) {
        return null
    }

    const activeId = toStringId(active.id)
    const overId = toStringId(over.id)

    if (activeId === overId) {
        return null
    }

    const oldIndex = funds.findIndex((fund) => fund.id === activeId)
    const newIndex = funds.findIndex((fund) => fund.id === overId)

    if (oldIndex < 0 || newIndex < 0) {
        return null
    }

    return arrayMove(
        funds.map((fund) => fund.id),
        oldIndex,
        newIndex,
    )
}

export const buildReorderFundsDto = (fundIds: string[]): ReorderFundsDto => {
    return {
        items: fundIds.map((id, index) => ({
            id,
            order: index,
        })),
    }
}

export const applyFundOrder = (
    funds: FundType[],
    fundIds: string[],
): FundType[] => {
    const orderById = new Map(fundIds.map((id, index) => [id, index]))

    return [...funds]
        .sort((a, b) => {
            const aOrder = orderById.get(a.id)
            const bOrder = orderById.get(b.id)

            if (aOrder === undefined || bOrder === undefined) {
                return a.order - b.order
            }

            return aOrder - bOrder
        })
        .map((fund) => ({
            ...fund,
            order: orderById.get(fund.id) ?? fund.order,
        }))
}
