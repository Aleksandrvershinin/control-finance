import { AccountFilterSection } from './AccountFilterSection'
import { TransactionTypeFilterSection } from './TransactionTypeFilterSection'
import { CategoryFilterSection } from './CategoryFilterSection'
import { FundFilterSection } from './FundFilterSection'
import { DateRangeFilter } from './DateRangeFilter'
import { useMainFilterStore } from '@/features/mainFilter'
import { Button, Stack } from '@/shared/ui'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'

export const MainFilterPanel = () => {
    const { value: open, setValue } = useAccordion(ACCORDION_KEYS.MAIN_FILTERS)

    const handleChange = (value: string) => {
        setValue(value)
    }
    const resetFilters = useMainFilterStore((s) => s.resetFilters)

    return (
        <Accordion
            type="single"
            collapsible
            value={open}
            onValueChange={handleChange}
        >
            <AccordionItem
                className="border-none"
                value={ACCORDION_KEYS.MAIN_FILTERS}
            >
                <>
                    <AccordionTrigger className="lg:justify-start gap-2">
                        <h3 className="text-2xl font-bold">Фильтры</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Stack direction={'column'} spacing={3}>
                            <Button
                                className="w-fit"
                                type="button"
                                onClick={resetFilters}
                            >
                                Сбросить
                            </Button>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                                <AccountFilterSection />
                                <TransactionTypeFilterSection />
                                <CategoryFilterSection />
                                <FundFilterSection />
                                <DateRangeFilter />
                            </div>
                        </Stack>
                    </AccordionContent>
                </>
            </AccordionItem>
        </Accordion>
    )
}
