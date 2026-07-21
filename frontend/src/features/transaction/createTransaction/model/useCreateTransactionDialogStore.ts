import { Transaction, TRANSFER_TYPES } from '@/entities/transaction'
import { create } from 'zustand'

export interface CreateTransactionConfig {
    type: Exclude<Transaction['type'], 'INITIAL'>
    transferType?: (typeof TRANSFER_TYPES)[keyof typeof TRANSFER_TYPES]
    accountId?: string
}

type CreateTransactionDialogState = {
    isOpen: boolean
    config: CreateTransactionConfig | null
    open: (config: CreateTransactionConfig) => void
    close: () => void
    clear: () => void
}

export const useCreateTransactionDialogStore =
    create<CreateTransactionDialogState>((set) => ({
        isOpen: false,
        config: null,

        open: (config) =>
            set({
                isOpen: true,
                config,
            }),

        close: () =>
            set({
                isOpen: false,
            }),

        clear: () =>
            set({
                config: null,
            }),
    }))
