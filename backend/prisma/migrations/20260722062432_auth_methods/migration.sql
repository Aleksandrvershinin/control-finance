-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'TELEGRAM');

-- CreateTable
CREATE TABLE "AuthMethod" (
    "id" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "passwordHash" TEXT,
    "loginCodeHash" TEXT,
    "loginCodeExpire" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "loginBlockedUntil" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthMethod_userId_idx" ON "AuthMethod"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthMethod_provider_providerId_key" ON "AuthMethod"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "AuthMethod" (
    "id",
    "provider",
    "providerId",
    "passwordHash",
    "loginCodeHash",
    "loginCodeExpire",
    "loginAttempts",
    "loginBlockedUntil",
    "userId",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    'EMAIL',
    "email",
    "password",
    "loginCodeHash",
    "loginCodeExpire",
    "loginAttempts",
    "loginBlockedUntil",
    "id",
    NOW(),
    NOW()
FROM "User";
