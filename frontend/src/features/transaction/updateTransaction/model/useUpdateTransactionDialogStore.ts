import { Transaction } from '@/entities/transaction'
import { create } from 'zustand'

type UpdateTransactionDialogState = {
    isOpen: boolean
    transaction: Transaction | null
    open: (transaction: Transaction) => void
    close: () => void
    clear: () => void
}

export const useUpdateTransactionDialogStore =
    create<UpdateTransactionDialogState>((set) => ({
        isOpen: false,
        transaction: null,

        open: (transaction) =>
            set({
                isOpen: true,
                transaction,
            }),

        close: () =>
            set({
                isOpen: false,
            }),

        clear: () =>
            set({
                transaction: null,
            }),
    }))
