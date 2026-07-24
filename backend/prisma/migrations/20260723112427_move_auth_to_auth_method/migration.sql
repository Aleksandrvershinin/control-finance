/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginAttempts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginBlockedUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginCodeExpire` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginCodeHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "VerificationCode_userId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "loginAttempts",
DROP COLUMN "loginBlockedUntil",
DROP COLUMN "loginCodeExpire",
DROP COLUMN "loginCodeHash",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "userId";
