import { cn } from '@/shared/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import React from 'react'

type SortableFundItemProps = {
    id: string
    children: React.ReactNode
}

export const SortableFundItem: React.FC<SortableFundItemProps> = ({
    id,
    children,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn('touch-none relative', {
                'opacity-70 z-10': isDragging,
            })}
        >
            <button
                type="button"
                ref={setActivatorNodeRef}
                className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-[--neutral-300] bg-white text-[--neutral-500] flex items-center justify-center cursor-grab active:cursor-grabbing"
                aria-label="Перетащить карточку фонда"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={12} />
            </button>
            {children}
        </li>
    )
}
