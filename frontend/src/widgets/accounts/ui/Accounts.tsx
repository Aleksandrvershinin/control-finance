import { useSuspenseAccounts } from '@/entities/account'
import { getAccountsTotal } from '@/entities/account/lib/getAccountsTotal'
import { CreateAccountButton } from '@/features/account/createAccount'
import {
    CreateAccountDialog,
    UpdateAccountDialog,
    DeleteAccountDialog,
} from '@/features/account'

import { Stack } from '@/shared/ui/Stack'
import { useSuspensCurrentUser } from '@/entities/user'
import { useGetCurrencyById } from '@/entities/currency'
import { AccountsTotalCard } from './AccountsTotalCard'
import { SortableAccountsList } from './SortableAccountsList'
import { useMainFilterStore } from '@/features/mainFilter'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'

export const Accounts = () => {
    const { value: open, setValue } = useAccordion(ACCORDION_KEYS.ACCOUNTS)

    const handleChange = (value: string) => {
        setValue(value)
    }
    const accountIds = useMainFilterStore((s) => s.filters.accountIds)
    const user = useSuspensCurrentUser().data
    const {
        data: { accounts },
        isFetching,
    } = useSuspenseAccounts()
    const filteredAccounts = accountIds?.length
        ? accounts.filter((acc) => accountIds.includes(acc.id))
        : accounts
    const getCurrencyById = useGetCurrencyById()
    const currency = getCurrencyById(user?.currencyId)
    const total = getAccountsTotal(filteredAccounts)
    return (
        <>
            <CreateAccountDialog />
            <UpdateAccountDialog />
            <DeleteAccountDialog />
            <Accordion
                type="single"
                collapsible
                value={open}
                onValueChange={handleChange}
            >
                <AccordionItem
                    className="border-none"
                    value={ACCORDION_KEYS.ACCOUNTS}
                >
                    <AccordionTrigger>
                        <h3 className="text-2xl font-bold">Счета</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Stack direction="column" spacing={5}>
                            <CreateAccountButton />
                            <AccountsTotalCard
                                total={total}
                                currencyCode={currency.code}
                                isFetching={isFetching}
                            />
                            <SortableAccountsList
                                accounts={filteredAccounts}
                                isFetching={isFetching}
                                currencyCode={currency.code}
                                currencySymbol={currency.symbol}
                            />
                        </Stack>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}
