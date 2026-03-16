import { create } from 'zustand'

interface CreateFundDialogState {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useCreateFundDialogStore = create<CreateFundDialogState>(
    (set) => ({
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
    }),
)
