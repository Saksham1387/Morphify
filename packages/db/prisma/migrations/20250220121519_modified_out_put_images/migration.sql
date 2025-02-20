/*
  Warnings:

  - The values [Asian American,East Asian,South East Asian,South Asian,Middle Eastern] on the enum `ModelEthinicityEnum` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterEnum
BEGIN;
CREATE TYPE "ModelEthinicityEnum_new" AS ENUM ('White', 'Black', 'Asian_American', 'East_Asian', 'South_East_Asian', 'South_Asian', 'Middle_Eastern', 'Pacific', 'Hispanic');
ALTER TABLE "Model" ALTER COLUMN "ethinicity" TYPE "ModelEthinicityEnum_new" USING ("ethinicity"::text::"ModelEthinicityEnum_new");
ALTER TYPE "ModelEthinicityEnum" RENAME TO "ModelEthinicityEnum_old";
ALTER TYPE "ModelEthinicityEnum_new" RENAME TO "ModelEthinicityEnum";
DROP TYPE "ModelEthinicityEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'Pending';
