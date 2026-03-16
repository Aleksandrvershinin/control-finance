import { useGetCurrencyById } from '@/entities/currency'
import { useSuspenseFunds } from '@/entities/fund'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import { useMainFilterStore } from '@/features/mainFilter'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'
import { SortableFundsList } from './SortableFundsList'

export const FundsWidget = () => {
    const { value: open, setValue } = useAccordion(ACCORDION_KEYS.FUNDS)

    const handleChange = (value: string) => {
        setValue(value)
    }
    const {
        data: { funds },
        isFetching,
    } = useSuspenseFunds()
    const getCurrencyById = useGetCurrencyById()
    const fundIds = useMainFilterStore((s) => s.filters.fundIds)
    const filteredFunds = fundIds?.length
        ? funds.filter((fund) => fundIds.includes(fund.id))
        : funds
    return (
        <>
            {funds.length > 0 && (
                <Accordion
                    type="single"
                    collapsible
                    value={open}
                    onValueChange={handleChange}
                >
                    <AccordionItem
                        className="border-none"
                        value={ACCORDION_KEYS.FUNDS}
                    >
                        <AccordionTrigger>
                            <h3 className="text-2xl font-bold">Фонды</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <SortableFundsList
                                funds={filteredFunds}
                                isFetching={isFetching}
                                getCurrencyCode={(currencyId) =>
                                    getCurrencyById(currencyId).code
                                }
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </>
    )
}
