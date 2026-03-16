import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
