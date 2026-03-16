import { Account } from '@/entities/account'
import { create } from 'zustand'

interface UpdateAccountDialogState {
    account: Account | null
    open: (account: Account) => void
    close: () => void
}

export const useUpdateAccountDialogStore = create<UpdateAccountDialogState>(
    (set) => ({
        account: null,
        open: (account) => set({ account }),
        close: () => set({ account: null }),
    }),
)
