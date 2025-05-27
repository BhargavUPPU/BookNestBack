/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_created_by_id_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "created_by_id",
ADD COLUMN     "userUser_id" TEXT;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userUser_id_fkey" FOREIGN KEY ("userUser_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
