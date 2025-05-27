/*
  Warnings:

  - You are about to drop the column `publication_year` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publication_year",
ADD COLUMN     "call_number" TEXT,
ADD COLUMN     "ddc" TEXT,
ADD COLUMN     "isbn10" TEXT,
ADD COLUMN     "lcc" TEXT,
ADD COLUMN     "page_count" INTEGER,
ADD COLUMN     "price" VARCHAR(12),
ADD COLUMN     "primary_collection_id" TEXT,
ADD COLUMN     "publication_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BookItem" ALTER COLUMN "status" SET DEFAULT 'available',
ALTER COLUMN "condition" SET DEFAULT 'new';

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Group" (
    "group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tag_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "_BookToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BookToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_BookToGroup_B_index" ON "_BookToGroup"("B");

-- CreateIndex
CREATE INDEX "_BookToTag_B_index" ON "_BookToTag"("B");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_primary_collection_id_fkey" FOREIGN KEY ("primary_collection_id") REFERENCES "Collection"("collection_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGroup" ADD CONSTRAINT "_BookToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("book_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGroup" ADD CONSTRAINT "_BookToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTag" ADD CONSTRAINT "_BookToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("book_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTag" ADD CONSTRAINT "_BookToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
