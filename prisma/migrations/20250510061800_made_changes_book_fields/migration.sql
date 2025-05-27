/*
  Warnings:

  - You are about to drop the column `notes` on the `BookItem` table. All the data in the column will be lost.
  - You are about to drop the column `shelf_location` on the `BookItem` table. All the data in the column will be lost.
  - You are about to drop the `_BookToGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookToGroup" DROP CONSTRAINT "_BookToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToGroup" DROP CONSTRAINT "_BookToGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookToTag" DROP CONSTRAINT "_BookToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToTag" DROP CONSTRAINT "_BookToTag_B_fkey";

-- AlterTable
ALTER TABLE "BookItem" DROP COLUMN "notes",
DROP COLUMN "shelf_location",
ALTER COLUMN "barcode" DROP NOT NULL;

-- DropTable
DROP TABLE "_BookToGroup";

-- DropTable
DROP TABLE "_BookToTag";
