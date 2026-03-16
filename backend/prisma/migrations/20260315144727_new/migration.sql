-- DropForeignKey
ALTER TABLE "AccountFundBalance" DROP CONSTRAINT "AccountFundBalance_fundId_fkey";

-- AddForeignKey
ALTER TABLE "AccountFundBalance" ADD CONSTRAINT "AccountFundBalance_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE SET NULL ON UPDATE CASCADE;
