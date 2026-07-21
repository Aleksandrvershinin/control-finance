import { FundType } from '../model/fund.types'

export const getFundsTotal = (accounts: FundType[]) =>
    accounts.reduce((acc, f) => acc + (f.amount ?? 0), 0)
