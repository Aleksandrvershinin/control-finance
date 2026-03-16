import { create } from 'zustand'
interface Data {
    id: string
    name: string
}
interface DeleteAccountDialogState {
    data: Data | null
    open: (data: Data) => void
    close: () => void
}

export const useDeleteAccountDialogStore = create<DeleteAccountDialogState>(
    (set) => ({
        data: null,
        open: (data) => set({ data }),
        close: () => set({ data: null }),
    }),
)
