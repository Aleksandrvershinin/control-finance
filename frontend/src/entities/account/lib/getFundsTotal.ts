import { Account } from '../model/account.types'

export const getFundsTotal = (account: Account) =>
    account.funds.reduce((sum, f) => sum + f.balance, 0)
