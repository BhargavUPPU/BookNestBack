/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `CollectionBook` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collection_id` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionBook" DROP CONSTRAINT "CollectionBook_book_id_fkey";

-- DropForeignKey
ALTER TABLE "CollectionBook" DROP CONSTRAINT "CollectionBook_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_college_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_college_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
ADD COLUMN     "authors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "collection_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "CollectionBook";

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;
