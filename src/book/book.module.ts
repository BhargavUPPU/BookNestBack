import { Module } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AlgoliaBookService } from "src/algolia/algolia-book.service";

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService, AlgoliaBookService],
  exports: [BookService],
})
export class BookModule {}
