import { arrayMove } from '@dnd-kit/sortable'
import { Account, ReorderAccountsDto } from '@/entities/account'
import { DragEndEvent } from '@dnd-kit/core'

const toStringId = (id: DragEndEvent['active']['id']) => String(id)

export const getReorderedAccountIdsFromDragEvent = (
    accounts: Account[],
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

    const oldIndex = accounts.findIndex((account) => account.id === activeId)
    const newIndex = accounts.findIndex((account) => account.id === overId)

    if (oldIndex < 0 || newIndex < 0) {
        return null
    }

    return arrayMove(
        accounts.map((account) => account.id),
        oldIndex,
        newIndex,
    )
}

export const buildReorderAccountsDto = (
    accountIds: string[],
): ReorderAccountsDto => {
    return {
        items: accountIds.map((id, index) => ({
            id,
            order: index,
        })),
    }
}

export const applyAccountOrder = (
    accounts: Account[],
    accountIds: string[],
): Account[] => {
    const orderById = new Map(accountIds.map((id, index) => [id, index]))

    return [...accounts]
        .sort((a, b) => {
            const aOrder = orderById.get(a.id)
            const bOrder = orderById.get(b.id)

            if (aOrder === undefined || bOrder === undefined) {
                return a.order - b.order
            }

            return aOrder - bOrder
        })
        .map((account) => ({
            ...account,
            order: orderById.get(account.id) ?? account.order,
        }))
}
