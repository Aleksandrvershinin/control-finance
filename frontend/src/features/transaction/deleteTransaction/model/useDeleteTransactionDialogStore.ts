import { create } from 'zustand'

type State = {
    isOpen: boolean
    transactionId: string | null
    open: (transactionId: string) => void
    close: () => void
    clear: () => void
}

export const useDeleteTransactionDialogStore = create<State>((set) => ({
    isOpen: false,
    transactionId: null,

    open: (transactionId) => {
        set({
            isOpen: true,
            transactionId,
        })
    },

    close: () =>
        set({
            isOpen: false,
        }),

    clear: () =>
        set({
            transactionId: null,
        }),
}))
