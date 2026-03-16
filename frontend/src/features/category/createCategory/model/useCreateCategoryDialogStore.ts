import { create } from 'zustand'

interface CreateCategoryDialogState {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useCreateCategoryDialogStore = create<CreateCategoryDialogState>(
    (set) => ({
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
    }),
)
