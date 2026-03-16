import { Category } from '@/entities/category'
import { create } from 'zustand'

interface UpdateCategoryDialogState {
    category: Category | null
    isOpen: boolean
    open: (category: Category) => void
    close: () => void
}

export const useUpdateCategoryDialogStore = create<UpdateCategoryDialogState>(
    (set) => ({
        category: null,
        isOpen: false,
        open: (category) => set({ category, isOpen: true }),
        close: () => set({ category: null, isOpen: false }),
    }),
)
