import { create } from 'zustand'

interface CreateAccountDialogState {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useCreateAccountDialogStore = create<CreateAccountDialogState>(
    (set) => ({
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
    }),
)
