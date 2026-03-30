CREATE TYPE "VerificationCodeType" AS ENUM (
    'PASSWORD_CHANGE',
    'LOGIN',
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'TWO_FACTOR'
);

CREATE TYPE "VerificationCodeChannel" AS ENUM (
    'EMAIL',
    'SMS',
    'TELEGRAM',
    'AUTH_APP'
);

CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "type" "VerificationCodeType" NOT NULL,
    "channel" "VerificationCodeChannel" NOT NULL,
    "target" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "metadata" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VerificationCode_type_channel_target_key"
ON "VerificationCode"("type", "channel", "target");

CREATE INDEX "VerificationCode_userId_idx" ON "VerificationCode"("userId");
CREATE INDEX "VerificationCode_expireAt_idx" ON "VerificationCode"("expireAt");
CREATE INDEX "VerificationCode_consumedAt_idx" ON "VerificationCode"("consumedAt");

ALTER TABLE "VerificationCode"
ADD CONSTRAINT "VerificationCode_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
