import { Account } from '../model/account.types'
import { getFundsTotal } from './getFundsTotal'

export const getBalanceWithoutFunds = (account: Account) => {
    const fundsTotal = getFundsTotal(account)
    return (account.balance ?? 0) - fundsTotal
}
