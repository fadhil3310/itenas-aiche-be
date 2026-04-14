-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT';
