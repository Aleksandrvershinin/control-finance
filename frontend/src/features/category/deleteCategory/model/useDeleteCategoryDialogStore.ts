import { create } from 'zustand'

interface DeleteCategoryDialogState {
    categoryId: string | null
    isOpen: boolean
    open: (categoryId: string) => void
    close: () => void
}

export const useDeleteCategoryDialogStore = create<DeleteCategoryDialogState>(
    (set) => ({
        categoryId: null,
        isOpen: false,
        open: (categoryId) => set({ categoryId, isOpen: true }),
        close: () => set({ categoryId: null, isOpen: false }),
    }),
)
