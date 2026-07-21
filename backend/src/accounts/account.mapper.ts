import { Prisma } from '@prisma/client'

// Новый тип: запрашиваем баланс из таблицы AccountBalance
type AccountWithRelations = Prisma.AccountGetPayload<{
    include: {
        balance: true // Модель AccountBalance
        user: { select: { currencyId: true } }
    }
}>

export function mapAccount(account: AccountWithRelations) {
    // Берем готовый агрегированный баланс из связанной таблицы.
    // Если записи почему-то нет (например, только создали счет), возвращаем 0.
    const totalBalance = account.balance ? Number(account.balance.balance) : 0

    return {
        id: account.id,
        name: account.name,
        order: account.order,
        isHidden: account.isHidden,
        balance: totalBalance,
        initialBalance: account.initialBalance.toNumber(),
        currencyId: account.user.currencyId,
    }
}
