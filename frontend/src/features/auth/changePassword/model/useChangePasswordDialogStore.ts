import { create } from 'zustand'

type ChangePasswordDialogState = {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useChangePasswordDialogStore = create<ChangePasswordDialogState>(
    (set) => ({
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
    }),
)
