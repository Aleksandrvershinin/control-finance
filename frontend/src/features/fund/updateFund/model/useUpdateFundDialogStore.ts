import { FundType } from '@/entities/fund'
import { create } from 'zustand'

interface UpdateFundDialogState {
    fund: FundType | null
    isOpen: boolean
    open: (fund: FundType) => void
    close: () => void
}

export const useUpdateFundDialogStore = create<UpdateFundDialogState>(
    (set) => ({
        fund: null,
        isOpen: false,
        open: (fund) => set({ fund, isOpen: true }),
        close: () => set({ fund: null, isOpen: false }),
    }),
)
