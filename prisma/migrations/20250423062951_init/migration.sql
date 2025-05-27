-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'librarian', 'admin');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('available', 'checked_out', 'reserved', 'lost', 'damaged');

-- CreateEnum
CREATE TYPE "BookCondition" AS ENUM ('new', 'good', 'worn', 'poor');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('active', 'returned', 'overdue', 'lost');

-- CreateEnum
CREATE TYPE "WaitingStatus" AS ENUM ('pending', 'notified', 'cancelled', 'fulfilled');

-- CreateEnum
CREATE TYPE "FineReason" AS ENUM ('overdue', 'lost', 'damage');

-- CreateEnum
CREATE TYPE "FineStatus" AS ENUM ('unpaid', 'paid', 'waived');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('fine_payment', 'book_rental', 'membership');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('success', 'failed', 'pending');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'online');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('book_available', 'due_reminder', 'fine_alert', 'general');

-- CreateTable
CREATE TABLE "College" (
    "college_id" TEXT NOT NULL,
    "college_name" TEXT NOT NULL,
    "college_location" TEXT NOT NULL,
    "total_students" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("college_id")
);

-- CreateTable
CREATE TABLE "Library" (
    "library_id" TEXT NOT NULL,
    "library_name" TEXT NOT NULL,
    "college_id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "opening_hours" JSONB NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("library_id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "collection_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "library_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("collection_id")
);

-- CreateTable
CREATE TABLE "CollectionBook" (
    "collection_book_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionBook_pkey" PRIMARY KEY ("collection_book_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "college_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "branch" TEXT NOT NULL,
    "max_books_allowed" INTEGER NOT NULL DEFAULT 5,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Book" (
    "book_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publication_year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover_image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "BookItem" (
    "item_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "status" "BookStatus" NOT NULL,
    "condition" "BookCondition" NOT NULL,
    "shelf_location" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookItem_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "BookIssued" (
    "issued_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "issued_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3),
    "status" "IssueStatus" NOT NULL,
    "renewed_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookIssued_pkey" PRIMARY KEY ("issued_id")
);

-- CreateTable
CREATE TABLE "WaitingList" (
    "waiting_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" "WaitingStatus" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("waiting_id")
);

-- CreateTable
CREATE TABLE "Fine" (
    "fine_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "issued_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reason" "FineReason" NOT NULL,
    "status" "FineStatus" NOT NULL,
    "paid_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("fine_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionBook_collection_id_book_id_key" ON "CollectionBook"("collection_id", "book_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "BookItem_barcode_key" ON "BookItem"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "BookIssued_item_id_key" ON "BookIssued"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_library_id_key" ON "WaitingList"("library_id");

-- CreateIndex
CREATE UNIQUE INDEX "Fine_issued_id_key" ON "Fine"("issued_id");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library"("library_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library"("library_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookItem" ADD CONSTRAINT "BookItem_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssued" ADD CONSTRAINT "BookIssued_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "BookItem"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssued" ADD CONSTRAINT "BookIssued_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library"("library_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_issued_id_fkey" FOREIGN KEY ("issued_id") REFERENCES "BookIssued"("issued_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
