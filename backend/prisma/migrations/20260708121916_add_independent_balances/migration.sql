-- CreateTable
CREATE TABLE "AccountBalance" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundBalance" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountBalance_accountId_key" ON "AccountBalance"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "FundBalance_fundId_key" ON "FundBalance"("fundId");

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundBalance" ADD CONSTRAINT "FundBalance_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 1. Наполняем таблицу AccountBalance, суммируя все записи из LedgerEntry для каждого аккаунта
INSERT INTO "AccountBalance" ("id", "accountId", "balance", "updatedAt")
SELECT
    gen_random_uuid(),
    "accountId",
    COALESCE(SUM("amount"), 0),
    NOW()
FROM "LedgerEntry"
GROUP BY "accountId"
ON CONFLICT ("accountId") DO NOTHING;

-- 2. Наполняем таблицу FundBalance, суммируя все записи из LedgerEntry для каждого фонда
INSERT INTO "FundBalance" ("id", "fundId", "balance", "updatedAt")
SELECT
    gen_random_uuid(),
    "fundId",
    COALESCE(SUM("amount"), 0),
    NOW()
FROM "LedgerEntry"
WHERE "fundId" IS NOT NULL
GROUP BY "fundId"
ON CONFLICT ("fundId") DO NOTHING;