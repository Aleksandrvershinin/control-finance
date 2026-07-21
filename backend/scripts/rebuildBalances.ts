import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function rebuildBalances() {
    await prisma.accountBalance.deleteMany()
    await prisma.fundBalance.deleteMany()

    await prisma.$executeRawUnsafe(`
        INSERT INTO "AccountBalance" ("id", "accountId", "balance", "updatedAt")
        SELECT
            gen_random_uuid(),
            "accountId",
            COALESCE(SUM("amount"), 0),
            NOW()
        FROM "LedgerEntry"
        GROUP BY "accountId"
    `)

    await prisma.$executeRawUnsafe(`
        INSERT INTO "FundBalance" ("id", "fundId", "balance", "updatedAt")
        SELECT
            gen_random_uuid(),
            "fundId",
            COALESCE(SUM("amount"), 0),
            NOW()
        FROM "LedgerEntry"
        WHERE "fundId" IS NOT NULL
        GROUP BY "fundId"
    `)

    console.log('Balances rebuilt')
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
