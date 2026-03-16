import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AccordionKey } from './accordionKeys'

export interface AccordionState {
    accordions: Record<AccordionKey, string | undefined>
    setAccordionValue: (key: AccordionKey, value?: string) => void
    clearAccordionValue: (key: AccordionKey) => void
}

export const useAccordionStore = create<AccordionState>()(
    persist(
        (set) => ({
            accordions: {
                main_filters: 'main_filters',
                accounts: 'accounts',
                funds: 'funds',
                transactions: 'transactions',
            },
            setAccordionValue: (key, value) =>
                set((state) => ({
                    accordions: {
                        ...state.accordions,
                        [key]: value,
                    },
                })),
            clearAccordionValue: (key) =>
                set((state) => {
                    const nextAccordions = { ...state.accordions }
                    delete nextAccordions[key]

                    return {
                        accordions: nextAccordions,
                    }
                }),
        }),
        {
            name: 'accordion-store',
        },
    ),
)
