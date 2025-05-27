/*
  Warnings:

  - A unique constraint covering the columns `[book_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_book_id_key" ON "Favorite"("book_id");
