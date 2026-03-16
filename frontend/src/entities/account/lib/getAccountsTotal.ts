import { Account } from '../model/account.types'

export const getAccountsTotal = (accounts: Account[]) =>
    accounts.reduce((acc, a) => acc + (a.balance ?? 0), 0)
