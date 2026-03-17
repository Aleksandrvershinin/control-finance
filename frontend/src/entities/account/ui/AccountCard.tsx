import React from 'react'
import { Account } from '../model/account.types'
import { Stack } from '@/shared/ui/Stack'
import { formatCurrency } from '@/shared/lib/utils/formatCurrency'

interface AccountCardProps {
    account: Account
    incomeAction?: React.ReactNode
    expenseAction?: React.ReactNode
    transferAction?: React.ReactNode
    visibilityAction?: React.ReactNode
    editAction?: React.ReactNode
    deleteAction?: React.ReactNode
    funds?: React.ReactNode
    currencyCode: string
    currencySymbol: string
}

export const AccountCard: React.FC<AccountCardProps> = ({
    account,
    incomeAction,
    expenseAction,
    transferAction,
    visibilityAction,
    editAction,
    deleteAction,
    funds,
    currencyCode,
    currencySymbol,
}) => {
    return (
        <Stack
            direction={'column'}
            className="p-4 rounded-2xl bg-white flex flex-col gap-2"
        >
            <Stack direction={'column'} spacing={2} className="w-full">
                <Stack justify={'between'} align={'center'} spacing={10}>
                    <div
                        title="Название счета"
                        className="text-lg font-semibold --neutral-700 overflow-hidden text-ellipsis line-clamp-2 truncate"
                    >
                        {account.name}
                    </div>
                    <div className="bg-[--neutral-200] text-[--neutral-700] font-medium px-3 py-1 rounded-full">
                        {currencySymbol}
                    </div>
                </Stack>
                <Stack justify={'between'} align={'center'} spacing={10}>
                    <div className="text-2xl font-bold text-[--neutral-900] tabular-nums">
                        {formatCurrency(account.balance ?? 0, currencyCode)}
                    </div>
                    <div className="text-sm font-semibold">{currencyCode}</div>
                </Stack>
                {funds}

                <Stack justify={'between'} align={'center'} spacing={2}>
                    <Stack>
                        <div>{incomeAction}</div>
                        <div>{expenseAction}</div>
                        <div>{transferAction}</div>
                    </Stack>
                    <Stack>
                        <div>{visibilityAction}</div>
                        <div>{editAction}</div>
                        <div>{deleteAction}</div>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
