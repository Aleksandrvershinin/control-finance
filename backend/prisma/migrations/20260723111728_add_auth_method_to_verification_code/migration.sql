-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "authMethodId" TEXT;

-- CreateIndex
CREATE INDEX "VerificationCode_authMethodId_idx" ON "VerificationCode"("authMethodId");

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_authMethodId_fkey" FOREIGN KEY ("authMethodId") REFERENCES "AuthMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "VerificationCode" vc
SET "authMethodId" = am.id
FROM "AuthMethod" am
WHERE vc."userId" = am."userId"
  AND am.provider = 'EMAIL';