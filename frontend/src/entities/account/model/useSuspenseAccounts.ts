import { useSuspenseQuery } from '@tanstack/react-query'
import { accountApi } from '../api/account.api'
import { Account } from './account.types'

export const useSuspenseAccounts = () => {
    return useSuspenseQuery({
        ...accountApi.getAccountsQueryOptions(),
        select: (accounts) => {
            const accountsMap = new Map<string, Account>()
            for (const acc of accounts) accountsMap.set(acc.id, acc)
            return { accounts, accountsMap }
        },
    })
}
