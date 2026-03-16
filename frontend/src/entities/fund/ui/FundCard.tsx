import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/lib/utils/formatCurrency'
import { Stack } from '@/shared/ui'
import React from 'react'

interface FundCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
    balance?: number
    currencyCode?: string
    color?: string
}

export const FundCard = ({
    name,
    balance,
    currencyCode,
    color = '#d1d5db',
    className,
    style,
    ...rest
}: FundCardProps) => {
    return (
        <Stack
            align="center"
            justify="between"
            className={cn(
                'px-4 py-2 rounded-lg border border-l-8 font-medium',
                className,
            )}
            style={{
                borderColor: color,
                backgroundColor: `color-mix(in srgb, ${color} 30%, white)`,
                ...style,
            }}
            {...rest}
        >
            <div title={name} className="truncate">
                {name}
            </div>

            {balance !== undefined && currencyCode !== undefined && (
                <div className="w-28 text-right tabular-nums">
                    {formatCurrency(balance, currencyCode)}
                </div>
            )}
        </Stack>
    )
}
