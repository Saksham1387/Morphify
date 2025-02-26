/*
  Warnings:

  - Added the required column `status` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModelTrainingStatusEnum" AS ENUM ('Pending', 'Completed', 'Failed');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "status" "ModelTrainingStatusEnum" NOT NULL,
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "triggerWord" TEXT;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAiRequestId" TEXT,
ALTER COLUMN "imageUrl" SET DEFAULT '';
