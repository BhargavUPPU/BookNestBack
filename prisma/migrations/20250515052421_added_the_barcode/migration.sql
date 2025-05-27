/*
  Warnings:

  - Made the column `barcode` on table `BookItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookItem" ALTER COLUMN "barcode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;
