/*
  Warnings:

  - A unique constraint covering the columns `[user_id,book_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Favorite_book_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_book_id_key" ON "Favorite"("user_id", "book_id");
