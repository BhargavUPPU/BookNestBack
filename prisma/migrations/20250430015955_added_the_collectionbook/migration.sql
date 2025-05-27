/*
  Warnings:

  - You are about to drop the column `collection_id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `userUser_id` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_userUser_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "collection_id";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "description",
DROP COLUMN "userUser_id";

-- CreateTable
CREATE TABLE "CollectionBook" (
    "collection_book_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionBook_pkey" PRIMARY KEY ("collection_book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionBook_collection_id_book_id_key" ON "CollectionBook"("collection_id", "book_id");

-- AddForeignKey
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;
