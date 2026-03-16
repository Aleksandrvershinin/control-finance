import { Transaction } from '@/entities/transaction'
import { create } from 'zustand'

export interface CreateTransactionConfig {
    type: Exclude<Transaction['type'], 'INITIAL'>
    accountId: string
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
