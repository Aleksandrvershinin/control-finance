import { PrismaClient, Prisma, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

function random<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomAmount() {
    return new Prisma.Decimal((Math.random() * 1000 + 1).toFixed(2))
}

function randomDate() {
    const start = new Date(2024, 0, 1).getTime()
    const end = Date.now()
    return new Date(start + Math.random() * (end - start))
}

async function main() {
    // accounts
    const accounts = (
        await prisma.account.findMany({ select: { id: true } })
    ).map((a) => a.id)

    // категории по типам
    const incomeCategories = (
        await prisma.category.findMany({
            where: { type: TransactionType.INCOME },
            select: { id: true },
        })
    ).map((c) => c.id)

    const expenseCategories = (
        await prisma.category.findMany({
            where: { type: TransactionType.EXPENSE },
            select: { id: true },
        })
    ).map((c) => c.id)

    // фонды
    const funds = (await prisma.fund.findMany({ select: { id: true } })).map(
        (f) => f.id,
    )

    if (
        accounts.length === 0 ||
        funds.length === 0 ||
        incomeCategories.length === 0 ||
        expenseCategories.length === 0
    ) {
        console.error('В базе нет accounts, categories или funds!')
        return
    }

    for (let i = 0; i < 10000; i++) {
        const type = random([
            TransactionType.INCOME,
            TransactionType.EXPENSE,
            TransactionType.TRANSFER,
        ])

        const amount = randomAmount()

        const categoryId =
            type === TransactionType.TRANSFER
                ? null
                : type === TransactionType.INCOME
                  ? random(incomeCategories)
                  : random(expenseCategories)

        const transaction = await prisma.transaction.create({
            data: {
                type,
                amount,
                date: randomDate(),
                description: `Seed tx ${i}`,
                categoryId,
            },
        })

        if (type === TransactionType.TRANSFER) {
            const fromAccount = random(accounts)
            let toAccount = random(accounts)

            if (toAccount === fromAccount) {
                toAccount = accounts.find((a) => a !== fromAccount)!
            }

            await prisma.ledgerEntry.createMany({
                data: [
                    {
                        transactionId: transaction.id,
                        accountId: fromAccount,
                        fundId: random(funds),
                        amount: amount.neg(),
                    },
                    {
                        transactionId: transaction.id,
                        accountId: toAccount,
                        fundId: random(funds),
                        amount: amount,
                    },
                ],
            })
        } else {
            await prisma.ledgerEntry.create({
                data: {
                    transactionId: transaction.id,
                    accountId: random(accounts),
                    fundId: random(funds),
                    amount:
                        type === TransactionType.EXPENSE
                            ? amount.neg()
                            : amount,
                },
            })
        }

        if (i % 1000 === 0) {
            console.log(`created ${i}`)
        }
    }

    console.log('✅ 10000 transactions created')
}

async function rebuildBalances() {
    await prisma.accountFundBalance.deleteMany()

    await prisma.$executeRawUnsafe(`
    INSERT INTO "AccountFundBalance" ("id", "accountId", "fundId", "balance", "updatedAt")
    SELECT
      gen_random_uuid(),
      "accountId",
      "fundId",
      SUM("amount") as balance,
      NOW()
    FROM "LedgerEntry"
    GROUP BY "accountId", "fundId"
  `)

    console.log('balances rebuilt')
}

async function run() {
    await main()
    await rebuildBalances()
}

run()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
