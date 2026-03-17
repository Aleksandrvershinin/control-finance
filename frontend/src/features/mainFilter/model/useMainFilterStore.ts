import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FilterKeys, MainFilterParams } from './mainFilter.types'

export interface MainFilterState extends MainFilterParams {
    cursorHistory: string[]
    setFilter: (key: FilterKeys, value?: string | string[]) => void
    setSort: (field: MainFilterParams['sortField']) => void
    setCursor: (cursor?: string) => void
    resetFilters: () => void
    saveNextCursor: (cursor: string) => void
    goToPreviousCursor: () => void
}

export const useMainFilterStore = create<MainFilterState>()(
    persist(
        (set, get) => ({
            filters: {},
            cursorHistory: [],

            setFilter: (key, value) => {
                set((state) => ({
                    filters: {
                        ...state.filters,
                        [key]: value,
                    },
                    cursor: undefined,
                    cursorHistory: [],
                }))
            },

            setSort: (field) => {
                const { sortField, sortOrder } = get()
                if (sortField === field) {
                    set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
                } else {
                    set({ sortField: field, sortOrder: 'asc' })
                }
                set({ cursor: undefined, cursorHistory: [] })
            },

            setCursor: (cursor) => set({ cursor }),

            saveNextCursor: (cursor) =>
                set((state) => ({
                    cursorHistory: [...state.cursorHistory, cursor],
                    cursor,
                })),

            goToPreviousCursor: () =>
                set((state) => {
                    const history = [...state.cursorHistory]
                    history.pop() // текущий курсор убираем
                    const prevCursor = history.pop() // берем предыдущий
                    return {
                        cursorHistory: history,
                        cursor: prevCursor,
                    }
                }),

            resetFilters: () =>
                set({
                    filters: {},
                    cursor: undefined,
                    cursorHistory: [],
                }),
            handleError: () => {
                get().resetFilters()
            },
        }),
        { name: 'main-filter-store' },
    ),
)
