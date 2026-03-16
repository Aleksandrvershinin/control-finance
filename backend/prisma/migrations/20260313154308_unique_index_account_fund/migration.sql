CREATE UNIQUE INDEX account_balance_account_fund_not_null
ON "AccountFundBalance" ("accountId", "fundId")
WHERE "fundId" IS NOT NULL;

CREATE UNIQUE INDEX account_balance_account_null_fund
ON "AccountFundBalance" ("accountId")
WHERE "fundId" IS NULL;