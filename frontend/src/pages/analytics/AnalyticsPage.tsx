import { useSuspenseAccounts } from '@/entities/account'
import { useSuspenseCurrencies } from '@/entities/currency'
import { useSuspenseFunds } from '@/entities/fund'
import {
    TransactionAnalytics,
    useTransactionAnalytics,
} from '@/entities/transaction'
import { useSuspensCurrentUser } from '@/entities/user'
import {
    transformMainFilterToTransactionQueryDto,
    useMainFilterStore,
} from '@/features/mainFilter'
import { formatCurrency } from '@/shared/lib/utils/formatCurrency'
import { cn } from '@/shared/lib/utils'
import { Stack } from '@/shared/ui'
import { MainFilterPanel } from '@/widgets/mainFilterPanel'
import { ReactNode } from 'react'

const formatPercent = (value: number) => `${value.toFixed(1)}%`

export const AnalyticsPage = () => {
    const filterState = useMainFilterStore()
    const queryParams = transformMainFilterToTransactionQueryDto(filterState)
    const { data: currentUser } = useSuspensCurrentUser()
    const {
        data: { currenciesMap },
    } = useSuspenseCurrencies()
    const {
        data: { accounts },
    } = useSuspenseAccounts()
    const {
        data: { funds },
    } = useSuspenseFunds()

    const currencyCode =
        (currentUser
            ? currenciesMap.get(currentUser.currencyId)?.code
            : undefined) ?? 'USD'

    const { data, isLoading, isFetching } = useTransactionAnalytics(
        queryParams,
        {
            onError: () => {
                filterState.resetFilters()
            },
        },
    )

    const accountBalances = new Map(
        accounts.map((account) => [account.id, account.balance ?? 0]),
    )
    const fundBalances = new Map(funds.map((fund) => [fund.id, fund.amount]))

    return (
        <section>
            <Stack
                direction={'column'}
                className="container mx-auto gap-4 pb-10"
            >
                <div>
                    <h1 className="text-3xl font-bold">Аналитика</h1>
                    <p className="text-sm text-muted-foreground">
                        Полная сводка по доходам, расходам, счетам, фондам и
                        категориям за выбранный период.
                    </p>
                </div>

                <MainFilterPanel />

                {isLoading || !data ? (
                    <AnalyticsSkeleton />
                ) : (
                    <div
                        className={cn('space-y-6 transition-opacity', {
                            'opacity-70': isFetching,
                        })}
                    >
                        <OverviewSection
                            analytics={data}
                            currencyCode={currencyCode}
                        />
                        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                            <DailyDynamicsSection
                                items={data.byDate}
                                currencyCode={currencyCode}
                            />
                            <CategorySplitSection
                                analytics={data}
                                currencyCode={currencyCode}
                            />
                        </div>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <AccountsSection
                                items={data.byAccount}
                                accountBalances={accountBalances}
                                currencyCode={currencyCode}
                            />
                            <FundsSection
                                items={data.byFund}
                                fundBalances={fundBalances}
                                currencyCode={currencyCode}
                            />
                        </div>
                    </div>
                )}
            </Stack>
        </section>
    )
}

const OverviewSection = ({
    analytics,
    currencyCode,
}: {
    analytics: TransactionAnalytics
    currencyCode: string
}) => {
    const { overview } = analytics

    const metrics = [
        {
            label: 'Доход',
            value: formatCurrency(overview.incomeTotal, currencyCode),
            className: 'text-[var(--success-700)]',
        },
        {
            label: 'Расход',
            value: formatCurrency(overview.expenseTotal, currencyCode),
            className: 'text-[var(--error-700)]',
        },
        {
            label: 'Чистый результат',
            value: formatCurrency(overview.net, currencyCode),
            className:
                overview.net >= 0
                    ? 'text-[var(--primary-600)]'
                    : 'text-[var(--error-700)]',
        },
        {
            label: 'Переводы',
            value: formatCurrency(overview.transferTotal, currencyCode),
            className: 'text-[var(--warning-700)]',
        },
        {
            label: 'Средний доход',
            value: formatCurrency(overview.averageIncome, currencyCode),
            className: '',
        },
        {
            label: 'Средний расход',
            value: formatCurrency(overview.averageExpense, currencyCode),
            className: '',
        },
        {
            label: 'Макс. доход',
            value: formatCurrency(overview.largestIncome, currencyCode),
            className: '',
        },
        {
            label: 'Макс. расход',
            value: formatCurrency(overview.largestExpense, currencyCode),
            className: '',
        },
        {
            label: 'Операций',
            value: String(overview.transactionsCount),
            className: '',
            hint: `Доходов: ${overview.incomeCount} · Расходов: ${overview.expenseCount} · Переводов: ${overview.transferCount}`,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {metrics.map((metric) => (
                <SurfaceCard key={metric.label}>
                    <p className="text-sm text-muted-foreground">
                        {metric.label}
                    </p>
                    <p
                        className={cn(
                            'mt-2 text-2xl font-semibold',
                            metric.className,
                        )}
                    >
                        {metric.value}
                    </p>
                    {metric.hint && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {metric.hint}
                        </p>
                    )}
                </SurfaceCard>
            ))}
        </div>
    )
}

const DailyDynamicsSection = ({
    items,
    currencyCode,
}: {
    items: TransactionAnalytics['byDate']
    currencyCode: string
}) => {
    const maxValue = Math.max(
        1,
        ...items.flatMap((item) => [item.income, item.expense, item.transfer]),
    )
    const recentItems = items.slice(-14).reverse()

    return (
        <SurfaceCard>
            <SectionHeading
                title="Дневная динамика"
                subtitle="Последние 14 дней из выбранного диапазона"
            />
            <div className="mt-4 space-y-3">
                {recentItems.length === 0 && (
                    <EmptyState text="Нет данных для выбранного периода" />
                )}
                {recentItems.map((item) => (
                    <div key={item.date} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium">{item.date}</span>
                            <span
                                className={cn('font-semibold', {
                                    'text-[var(--error-700)]': item.net < 0,
                                    'text-[var(--primary-600)]': item.net >= 0,
                                })}
                            >
                                {formatCurrency(item.net, currencyCode)}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <MetricBar
                                label="Доход"
                                value={item.income}
                                maxValue={maxValue}
                                colorClass="bg-[var(--success-500)]"
                                currencyCode={currencyCode}
                            />
                            <MetricBar
                                label="Расход"
                                value={item.expense}
                                maxValue={maxValue}
                                colorClass="bg-[var(--error-500)]"
                                currencyCode={currencyCode}
                            />
                            <MetricBar
                                label="Переводы"
                                value={item.transfer}
                                maxValue={maxValue}
                                colorClass="bg-[var(--warning-500)]"
                                currencyCode={currencyCode}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </SurfaceCard>
    )
}

const CategorySplitSection = ({
    analytics,
    currencyCode,
}: {
    analytics: TransactionAnalytics
    currencyCode: string
}) => {
    const expenseItems = analytics.byCategory.filter(
        (item) => item.type === 'EXPENSE',
    )
    const incomeItems = analytics.byCategory.filter(
        (item) => item.type === 'INCOME',
    )

    return (
        <SurfaceCard>
            <SectionHeading
                title="Категории"
                subtitle="Распределение доходов и расходов по категориям"
            />
            <div className="mt-4 space-y-5">
                <CategoryGroup
                    title="Расходы"
                    items={expenseItems}
                    currencyCode={currencyCode}
                    emptyText="Расходов по категориям нет"
                />
                <CategoryGroup
                    title="Доходы"
                    items={incomeItems}
                    currencyCode={currencyCode}
                    emptyText="Доходов по категориям нет"
                />
            </div>
        </SurfaceCard>
    )
}

const AccountsSection = ({
    items,
    accountBalances,
    currencyCode,
}: {
    items: TransactionAnalytics['byAccount']
    accountBalances: Map<string, number>
    currencyCode: string
}) => {
    return (
        <SurfaceCard>
            <SectionHeading
                title="Счета"
                subtitle="Обороты и вклад каждого счёта в итог периода"
            />
            <div className="mt-4 space-y-3">
                {items.length === 0 && (
                    <EmptyState text="Нет данных по счетам" />
                )}
                {items.map((item) => (
                    <BreakdownCard
                        key={item.accountId}
                        title={item.accountName}
                        badges={[
                            `Транзакций: ${item.transactionCount}`,
                            `Текущий баланс: ${formatCurrency(
                                accountBalances.get(item.accountId) ?? 0,
                                currencyCode,
                            )}`,
                        ]}
                        metrics={[
                            [
                                'Доход',
                                formatCurrency(item.income, currencyCode),
                            ],
                            [
                                'Расход',
                                formatCurrency(item.expense, currencyCode),
                            ],
                            [
                                'Переводы +',
                                formatCurrency(item.transferIn, currencyCode),
                            ],
                            [
                                'Переводы -',
                                formatCurrency(item.transferOut, currencyCode),
                            ],
                            [
                                'Стартовый баланс',
                                formatCurrency(
                                    item.initialBalance,
                                    currencyCode,
                                ),
                            ],
                            ['Нетто', formatCurrency(item.net, currencyCode)],
                        ]}
                        accentClass={
                            item.net >= 0
                                ? 'text-[var(--primary-600)]'
                                : 'text-[var(--error-700)]'
                        }
                    />
                ))}
            </div>
        </SurfaceCard>
    )
}

const FundsSection = ({
    items,
    fundBalances,
    currencyCode,
}: {
    items: TransactionAnalytics['byFund']
    fundBalances: Map<string, number>
    currencyCode: string
}) => {
    return (
        <SurfaceCard>
            <SectionHeading
                title="Фонды"
                subtitle="Обороты по фондам и свободным операциям без фонда"
            />
            <div className="mt-4 space-y-3">
                {items.length === 0 && (
                    <EmptyState text="Нет данных по фондам" />
                )}
                {items.map((item) => (
                    <BreakdownCard
                        key={item.fundId ?? 'no-fund'}
                        title={item.fundName}
                        badges={[
                            `Транзакций: ${item.transactionCount}`,
                            `Текущий баланс: ${formatCurrency(
                                item.fundId
                                    ? (fundBalances.get(item.fundId) ?? 0)
                                    : 0,
                                currencyCode,
                            )}`,
                        ]}
                        metrics={[
                            [
                                'Доход',
                                formatCurrency(item.income, currencyCode),
                            ],
                            [
                                'Расход',
                                formatCurrency(item.expense, currencyCode),
                            ],
                            [
                                'Переводы +',
                                formatCurrency(item.transferIn, currencyCode),
                            ],
                            [
                                'Переводы -',
                                formatCurrency(item.transferOut, currencyCode),
                            ],
                            ['Нетто', formatCurrency(item.net, currencyCode)],
                        ]}
                        accentClass={
                            item.net >= 0
                                ? 'text-[var(--primary-600)]'
                                : 'text-[var(--error-700)]'
                        }
                        colorDot={item.colorBg ?? undefined}
                    />
                ))}
            </div>
        </SurfaceCard>
    )
}

const CategoryGroup = ({
    title,
    items,
    currencyCode,
    emptyText,
}: {
    title: string
    items: TransactionAnalytics['byCategory']
    currencyCode: string
    emptyText: string
}) => {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className="text-sm text-muted-foreground">
                    {items.length} позиций
                </span>
            </div>
            <div className="space-y-2">
                {items.length === 0 && <EmptyState text={emptyText} />}
                {items.slice(0, 8).map((item) => (
                    <div
                        key={`${item.type}-${item.categoryId ?? item.categoryName}`}
                        className="rounded-lg border p-3"
                    >
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="font-medium">
                                {item.categoryName}
                            </span>
                            <span className="font-semibold">
                                {formatCurrency(item.amount, currencyCode)}
                            </span>
                        </div>
                        <div className="mb-2 h-2 rounded-full bg-slate-100">
                            <div
                                className={cn('h-2 rounded-full', {
                                    'bg-[var(--error-500)]':
                                        item.type === 'EXPENSE',
                                    'bg-[var(--success-500)]':
                                        item.type === 'INCOME',
                                })}
                                style={{
                                    width: `${Math.min(item.share, 100)}%`,
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                            <span>Операций: {item.count}</span>
                            <span>Доля: {formatPercent(item.share)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const BreakdownCard = ({
    title,
    badges,
    metrics,
    accentClass,
    colorDot,
}: {
    title: string
    badges: string[]
    metrics: Array<[string, string]>
    accentClass: string
    colorDot?: string
}) => {
    return (
        <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {colorDot && (
                            <span
                                className="inline-block h-3 w-3 rounded-full border"
                                style={{ backgroundColor: colorDot }}
                            />
                        )}
                        <h3 className="truncate text-lg font-semibold">
                            {title}
                        </h3>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {badges.map((badge) => (
                            <span
                                key={badge}
                                className="rounded-full bg-slate-100 px-2 py-1"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
                <div
                    className={cn(
                        'text-right text-sm font-semibold',
                        accentClass,
                    )}
                >
                    {metrics[metrics.length - 1]?.[1]}
                </div>
            </div>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                {metrics.map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-md bg-slate-50 px-3 py-2 text-sm"
                    >
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="font-medium">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

const MetricBar = ({
    label,
    value,
    maxValue,
    colorClass,
    currencyCode,
}: {
    label: string
    value: number
    maxValue: number
    colorClass: string
    currencyCode: string
}) => {
    return (
        <div className="grid grid-cols-[72px_1fr_auto] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <div className="h-2 rounded-full bg-slate-100">
                <div
                    className={cn('h-2 rounded-full', colorClass)}
                    style={{ width: `${(value / maxValue) * 100}%` }}
                />
            </div>
            <span className="font-medium">
                {formatCurrency(value, currencyCode)}
            </span>
        </div>
    )
}

const SurfaceCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            {children}
        </div>
    )
}

const SectionHeading = ({
    title,
    subtitle,
}: {
    title: string
    subtitle: string
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
    )
}

const EmptyState = ({ text }: { text: string }) => {
    return (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            {text}
        </div>
    )
}

const AnalyticsSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 9 }, (_, index) => (
                    <div
                        key={index}
                        className="h-28 animate-pulse rounded-2xl bg-slate-100"
                    />
                ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
            </div>
        </div>
    )
}
