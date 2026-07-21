import { useGetCurrencyById } from '@/entities/currency'
import { FundCard, getFundsTotal, useSuspenseFunds } from '@/entities/fund'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import { useMainFilterStore } from '@/features/mainFilter'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'
import { SortableFundsList } from './SortableFundsList'
import { TransactionFundCreateButton } from '@/features/transaction/createTransaction'
import { useSuspensCurrentUser } from '@/entities/user'
import { useSuspenseAccounts } from '@/entities/account'
import { getAccountsTotal } from '@/entities/account/lib/getAccountsTotal'

export const FundsWidget = () => {
    const user = useSuspensCurrentUser().data
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
    const accountIds = useMainFilterStore((s) => s.filters.accountIds)
    const {
        data: { accounts },
    } = useSuspenseAccounts()
    const filteredAccounts = accountIds?.length
        ? accounts.filter((acc) => accountIds.includes(acc.id))
        : accounts
    const visibleAccounts = filteredAccounts.filter((acc) => !acc.isHidden)
    const total = getAccountsTotal(visibleAccounts)
    const filteredFunds = fundIds?.length
        ? funds.filter((fund) => fundIds.includes(fund.id))
        : funds
    const witoutFund = total - getFundsTotal(filteredFunds)
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
                            <div className="w-full mb-3">
                                <TransactionFundCreateButton />
                            </div>
                            {witoutFund !== 0 && (
                                <div className="mb-2">
                                    <FundCard
                                        className="pt-5"
                                        name={'Без фонда'}
                                        balance={witoutFund}
                                        color=""
                                        currencyCode={
                                            getCurrencyById(user?.currencyId)
                                                .code
                                        }
                                    />
                                </div>
                            )}

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
