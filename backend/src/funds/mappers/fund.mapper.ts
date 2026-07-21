import { Fund, Prisma } from '@prisma/client'

type FundWithExtras = Fund & {
    balance?: {
        balance: Prisma.Decimal
    } | null
    user?: {
        currencyId: string | null
    } | null
}

export const mapFund = (fund: FundWithExtras) => {
    const { balance, user, ...rest } = fund

    const amount = balance?.balance ? Number(balance.balance) : 0

    return {
        ...rest,
        amount,
        currencyId: user?.currencyId ?? null,
    }
}

export const mapFunds = (funds: FundWithExtras[]) => funds.map(mapFund)
