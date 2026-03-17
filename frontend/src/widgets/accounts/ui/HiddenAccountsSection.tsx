import { Account } from '@/entities/account'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'
import { AccountsListItem } from './AccountsListItem'

type HiddenAccountsSectionProps = {
    accounts: Account[]
    currencyCode: string
    currencySymbol: string
}

export const HiddenAccountsSection = ({
    accounts,
    currencyCode,
    currencySymbol,
}: HiddenAccountsSectionProps) => {
    const { value: open, setValue } = useAccordion(
        ACCORDION_KEYS.HIDDEN_ACCOUNTS,
    )

    const handleChange = (value: string) => {
        setValue(value)
    }

    if (!accounts.length) {
        return null
    }

    return (
        <Accordion
            type="single"
            collapsible
            value={open}
            onValueChange={handleChange}
        >
            <AccordionItem
                className="border-none"
                value={ACCORDION_KEYS.HIDDEN_ACCOUNTS}
            >
                <AccordionTrigger>
                    <h4 className="text-xl font-bold">Скрытые счета</h4>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="space-y-4">
                        {accounts.map((account) => (
                            <li key={account.id}>
                                <AccountsListItem
                                    account={account}
                                    currencyCode={currencyCode}
                                    currencySymbol={currencySymbol}
                                />
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
