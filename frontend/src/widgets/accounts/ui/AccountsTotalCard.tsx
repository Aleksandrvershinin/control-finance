import { formatCurrency } from '@/shared/lib/utils/formatCurrency'
import { cn } from '@/shared/lib/utils'
import { Stack } from '@/shared/ui/Stack'

type AccountsTotalCardProps = {
    total: number
    currencyCode: string
    isFetching: boolean
}

export const AccountsTotalCard = ({
    total,
    currencyCode,
    isFetching,
}: AccountsTotalCardProps) => {
    return (
        <Stack
            className={cn(
                { 'blur-sm': isFetching },
                'p-4 text-lg xl:text-xl text-[var(--success-600)] rounded-2xl bg-[var(--success-100)] font-bold whitespace-nowrap',
            )}
        >
            <p>Общая сумма:</p>
            <p>{formatCurrency(total, currencyCode)}</p>
        </Stack>
    )
}
