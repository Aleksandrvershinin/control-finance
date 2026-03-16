import { Prisma } from '@prisma/client'
type AccountWithRelations = Prisma.AccountGetPayload<{
    include: {
        accountFundBalances: { include: { fund: true } }
        user: { select: { currencyId: true } }
    }
}>
export function mapAccount(account: AccountWithRelations) {
    const totalBalance = account.accountFundBalances.reduce(
        (sum, f) => sum + Number(f.balance),
        0,
    )

    const funds = account.accountFundBalances
        .filter((f) => f.fund !== null)
        .map((f) => ({
            id: f.fund!.id,
            name: f.fund!.name,
            colorBg: f.fund!.colorBg,
            balance: Number(f.balance),
        }))

    return {
        id: account.id,
        name: account.name,
        order: account.order,
        balance: totalBalance,
        initialBalance: account.initialBalance.toNumber(),
        currencyId: account.user.currencyId,
        funds,
    }
}
