import { Account } from './account.types'
import { useSuspenseAccounts } from './useSuspenseAccounts'

export const useGetAccountById = () => {
    const {
        data: { accountsMap },
    } = useSuspenseAccounts()

    const getAccountByid = (accountId: string): Account | null => {
        const account = accountsMap.get(accountId)
        return account ?? null
    }

    return getAccountByid
}
