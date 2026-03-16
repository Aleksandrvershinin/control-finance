import { useTransaction } from '@/entities/transaction/model/useTransaction'
import { useTransactionSummary } from '@/entities/transaction'
import { ACCORDION_KEYS, useAccordion } from '@/features/accordion'
import {
    transformMainFilterToTransactionQueryDto,
    useMainFilterStore,
} from '@/features/mainFilter'
import { TransactionTable } from '@/features/transaction/listTransaction'
import { cn } from '@/shared/lib/utils'
import { PaginationButton, Stack } from '@/shared/ui'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion'

export const TransactionTableWidget = () => {
    const { value: open, setValue } = useAccordion(ACCORDION_KEYS.TRANSACTIONS)

    const handleChange = (value: string) => {
        setValue(value)
    }
    const state = useMainFilterStore()
    const queryParams = transformMainFilterToTransactionQueryDto(state)
    const { data, isLoading, isFetching } = useTransaction(queryParams)
    const { data: summary, isFetching: isSummaryFetching } =
        useTransactionSummary(queryParams)

    if (isLoading) return null

    const handleNextPage = () => {
        if (data?.nextCursor) {
            state.saveNextCursor(data.nextCursor)
        }
    }

    const handlePrevPage = () => {
        state.goToPreviousCursor()
    }

    return (
        <div>
            {data?.data && (
                <Accordion
                    type="single"
                    collapsible
                    value={open}
                    onValueChange={handleChange}
                >
                    <AccordionItem
                        className="border-none"
                        value={ACCORDION_KEYS.TRANSACTIONS}
                    >
                        <AccordionTrigger className="lg:p-2">
                            <h3 className="text-2xl font-bold">Транзакции</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div
                                className={cn(
                                    {
                                        'blur-sm':
                                            isFetching || isSummaryFetching,
                                    },
                                    'space-y-2',
                                )}
                            >
                                <TransactionsSummary
                                    income={summary?.incomeTotal ?? 0}
                                    expense={summary?.expenseTotal ?? 0}
                                    difference={summary?.difference ?? 0}
                                />
                                <PaginationControls
                                    canNext={Boolean(data?.nextCursor)}
                                    canPrev={state.cursorHistory.length > 0}
                                    onNext={handleNextPage}
                                    onPrev={handlePrevPage}
                                />
                                <TransactionTable
                                    transactions={data.data}
                                    sortField={state.sortField}
                                    sortOrder={state.sortOrder}
                                    onSortChange={(field) =>
                                        state.setSort(field)
                                    }
                                />

                                <PaginationControls
                                    canNext={Boolean(data?.nextCursor)}
                                    canPrev={state.cursorHistory.length > 1}
                                    onNext={handleNextPage}
                                    onPrev={handlePrevPage}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}

type PaginationControlsProps = {
    onPrev: () => void
    onNext: () => void
    canPrev: boolean
    canNext: boolean
}
export const PaginationControls = ({
    onPrev,
    onNext,
    canPrev,
    canNext,
}: PaginationControlsProps) => {
    return (
        <Stack justify={'end'} spacing={2}>
            {canPrev && <PaginationButton direction="prev" onClick={onPrev} />}

            {canNext && <PaginationButton direction="next" onClick={onNext} />}
        </Stack>
    )
}

type TransactionsSummaryProps = {
    income: number
    expense: number
    difference: number
}

const formatNumber = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value)

const TransactionsSummary = ({
    income,
    expense,
    difference,
}: TransactionsSummaryProps) => {
    return (
        <div className="grid gap-2 sm:grid-cols-3">
            <SummaryCard
                title="Доход"
                value={income}
                valueClassName="text-[--success-600]"
            />
            <SummaryCard
                title="Расход"
                value={expense}
                valueClassName="text-[--error-600]"
            />
            <SummaryCard
                title="Разница"
                value={difference}
                valueClassName={
                    difference >= 0
                        ? 'text-[--primary-500]'
                        : 'text-[--error-600]'
                }
            />
        </div>
    )
}

type SummaryCardProps = {
    title: string
    value: number
    valueClassName: string
}

const SummaryCard = ({ title, value, valueClassName }: SummaryCardProps) => {
    return (
        <div className="rounded-lg border bg-background p-3">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn('text-xl font-semibold', valueClassName)}>
                {formatNumber(value)}
            </p>
        </div>
    )
}
