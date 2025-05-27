import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookItemDto } from "./dto/create-book-item.dto";
import { UpdateBookItemDto } from "./dto/update-book-item.dto";
import { BookStatus } from "@prisma/client";
import { BookCondition } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class BookItemService {
  constructor(private prisma: PrismaService) {}

  async create(createBookItemDto: CreateBookItemDto) {
    // Check if book exists
    const book = await this.prisma.book.findUnique({
      where: { book_id: createBookItemDto.book_id },
    });

    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createBookItemDto.book_id} not found`
      );
    }

    if (createBookItemDto.barcode) {
      // Check if barcode is unique
      const existingBookItem = await this.prisma.bookItem.findUnique({
        where: { barcode: createBookItemDto.barcode },
      });

      if (existingBookItem) {
        throw new BadRequestException("Barcode already exists");
      }
    }
    return this.prisma.bookItem.create({
      data: {
        item_id: uuidv4(),
        book_id: createBookItemDto.book_id,
        barcode: createBookItemDto.barcode,
        status: createBookItemDto.status || BookStatus.available,
        condition: createBookItemDto.condition || BookCondition.new,
      },
      include: {
        book: true,
      },
    });
  }

  async findAll() {
    return this.prisma.bookItem.findMany({
      include: {
        book: true,
      },
    });
  }

  async findOne(item_id: string) {
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { item_id },
      include: {
        book: true,
      },
    });

    if (!bookItem) {
      throw new NotFoundException(`Book item with ID ${item_id} not found`);
    }

    return bookItem;
  }

  async update(item_id: string, updateBookItemDto: UpdateBookItemDto) {
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { item_id },
    });

    if (!bookItem) {
      throw new NotFoundException(`Book item with ID ${item_id} not found`);
    }

    // If book_id is being updated, verify the new book exists
    if (updateBookItemDto.book_id) {
      const book = await this.prisma.book.findUnique({
        where: { book_id: updateBookItemDto.book_id },
      });

      if (!book) {
        throw new NotFoundException(
          `Book with ID ${updateBookItemDto.book_id} not found`
        );
      }
    }

    // If barcode is being updated, check if it's already taken
    if (
      updateBookItemDto.barcode &&
      updateBookItemDto.barcode !== bookItem.barcode
    ) {
      const existingBookItem = await this.prisma.bookItem.findUnique({
        where: { barcode: updateBookItemDto.barcode },
      });

      if (existingBookItem) {
        throw new BadRequestException("Barcode already exists");
      }
    }

    return this.prisma.bookItem.update({
      where: { item_id },
      data: {
        barcode: updateBookItemDto.barcode,
        status: updateBookItemDto.status|| BookStatus.available,
        condition: updateBookItemDto.condition|| BookCondition.new,
      },
      include: {
        book: true,
      },
    });
  }

  async remove(item_id: string) {
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { item_id },
    });

    if (!bookItem) {
      throw new NotFoundException(`Book item with ID ${item_id} not found`);
    }

    return this.prisma.bookItem.delete({
      where: { item_id },
      include: {
        book: true,
      },
    });
  }

  async findByBook(book_id: string) {
    const book = await this.prisma.book.findUnique({
      where: { book_id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${book_id} not found`);
    }

    return this.prisma.bookItem.findMany({
      where: { book_id },
      include: {
        book: true,
      },
    });
  }

  async findByStatus(status: BookStatus) {
    return this.prisma.bookItem.findMany({
      where: { status },
      include: {
        book: true,
      },
    });
  }

  async findByBarcode(barcode: string) {
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { barcode },
      include: {
        book: true,
      },
    });

    if (!bookItem) {
      throw new NotFoundException(
        `Book item with barcode ${barcode} not found`
      );
    }

    return bookItem;
  }
}
