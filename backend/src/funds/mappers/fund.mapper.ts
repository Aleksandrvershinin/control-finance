import { Fund, Prisma } from '@prisma/client'

type FundWithExtras = Fund & {
    accountFundBalances?: Array<{
        balance: Prisma.Decimal | number | string | null
    }>
    user?: {
        currencyId: string | null
    } | null
}

export const mapFund = (fund: FundWithExtras) => {
    const { accountFundBalances = [], user, ...rest } = fund

    const amount = accountFundBalances.reduce(
        (sum, item) => sum.plus(item?.balance ?? 0),
        new Prisma.Decimal(0),
    )

    return {
        ...rest,
        amount: amount.toNumber(),
        currencyId: user?.currencyId ?? null,
    }
}

export const mapFunds = (funds: FundWithExtras[]) => funds.map(mapFund)
