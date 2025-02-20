/*
  Warnings:

  - The values [AsianAmerican,EastAsia,SouthEastAsian,SouthAsian,MiddleEastern] on the enum `ModelEthinicityEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModelEthinicityEnum_new" AS ENUM ('White', 'Black', 'Asian American', 'East Asian', 'South East Asian', 'South Asian', 'Middle Eastern', 'Pacific', 'Hispanic');
ALTER TABLE "Model" ALTER COLUMN "ethinicity" TYPE "ModelEthinicityEnum_new" USING ("ethinicity"::text::"ModelEthinicityEnum_new");
ALTER TYPE "ModelEthinicityEnum" RENAME TO "ModelEthinicityEnum_old";
ALTER TYPE "ModelEthinicityEnum_new" RENAME TO "ModelEthinicityEnum";
DROP TYPE "ModelEthinicityEnum_old";
COMMIT;
