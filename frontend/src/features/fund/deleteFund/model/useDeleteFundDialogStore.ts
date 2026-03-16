import { create } from 'zustand'

interface DeleteFundDialogState {
    fundId: string | null
    isOpen: boolean
    open: (fundId: string) => void
    close: () => void
}

export const useDeleteFundDialogStore = create<DeleteFundDialogState>(
    (set) => ({
        fundId: null,
        isOpen: false,
        open: (fundId) => set({ fundId, isOpen: true }),
        close: () => set({ fundId: null, isOpen: false }),
    }),
)
