import { AccordionKey } from './accordionKeys'
import { useAccordionStore } from './useAccordionStore'

interface UseAccordionResult {
    value: string | undefined
    setValue: (value?: string) => void
    clear: () => void
}

export const useAccordion = (key: AccordionKey): UseAccordionResult => {
    const value = useAccordionStore((s) => s.accordions[key])
    const setAccordionValue = useAccordionStore((s) => s.setAccordionValue)
    const clearAccordionValue = useAccordionStore((s) => s.clearAccordionValue)

    return {
        value,
        setValue: (nextValue) => setAccordionValue(key, nextValue),
        clear: () => clearAccordionValue(key),
    }
}
