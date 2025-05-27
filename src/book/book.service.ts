import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBookDto } from "./dto/search-book.dto";
import { AlgoliaBookService } from "../algolia/algolia-book.service";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { BookStatus } from "@prisma/client";

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    private algoliaBookService: AlgoliaBookService
  ) {}

  async create(createBookDto: CreateBookDto) {
    const library = await this.prisma.library.findUnique({
      where: { library_id: createBookDto.library_id },
    });

    if (!library) {
      throw new NotFoundException(
        `Library with ID ${createBookDto.library_id} not found`
      );
    }

    const existingBook = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    });
    // Check if the book with the same ISBN already exists

    if (existingBook) {
      throw new BadRequestException("ISBN already exists");
    }

    //Validate related records before creating the book
    if (createBookDto.primary_collection_id) {
      const primaryCollection = await this.prisma.collection.findUnique({
        where: { collection_id: createBookDto.primary_collection_id },
      });
      if (!primaryCollection) {
        throw new NotFoundException(
          `Primary collection with ID ${createBookDto.primary_collection_id} not found`
        );
      }
    }
    //cheack the barcode if it is already used
    if (createBookDto.barcode) {
      const existingItem = await this.prisma.bookItem.findUnique({
        where: { barcode: createBookDto.barcode },
      });
      if (existingItem) {
        throw new BadRequestException("Barcode already exists");
      }
    }

    const book = await this.prisma.book.create({
      data: {
        book_id: uuidv4(),
        title: createBookDto.title,
        authors: createBookDto.authors,
        isbn: createBookDto.isbn,
        isbn10: createBookDto.isbn10,
        publisher: createBookDto.publisher,
        publication_date: createBookDto.publication_date,
        category: createBookDto.category,
        library: {
          connect: {
            library_id: createBookDto.library_id,
          },
        },
        description: createBookDto.description,
        page_count: createBookDto.page_count,
        price: createBookDto.price,
        cover_image_url: createBookDto.cover_image_url,
        call_number: createBookDto.call_number,
        ddc: createBookDto.ddc,
        lcc: createBookDto.lcc,
        primary_collection: createBookDto.primary_collection_id
          ? {
              connect: {
                collection_id: createBookDto.primary_collection_id,
              },
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });
    if (createBookDto.create_item) {
      await this.prisma.bookItem.create({
        data: {
          item_id: uuidv4(), // Generate a unique ID for the item
          barcode: createBookDto.barcode,
          book: {
            connect: {
              book_id: book.book_id,
            },
          },
        },
      });
    }

    await this.algoliaBookService.indexBook(book);

    return book;
  }

  async findAll() {
    return this.prisma.book.findMany({
      include: {
        library: true,
        items: true,
      },
    });
  }

  async findOne(book_id: string) {
    const book = await this.prisma.book.findUnique({
      where: { book_id },
      include: {
        items: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${book_id} not found`);
    }

    return book;
  }

  async update(book_id: string, updateBookDto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { book_id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${book_id} not found`);
    }

    if (updateBookDto.library_id) {
      const library = await this.prisma.library.findUnique({
        where: { library_id: updateBookDto.library_id },
      });

      if (!library) {
        throw new NotFoundException(
          `Library with ID ${updateBookDto.library_id} not found`
        );
      }
    }

    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.prisma.book.findUnique({
        where: { isbn: updateBookDto.isbn },
      });

      if (existingBook) {
        throw new BadRequestException("ISBN already exists");
      }
    }

    return this.prisma.book.update({
      where: { book_id },
      data: {
        title: updateBookDto.title,
        authors: updateBookDto.authors,
        isbn: updateBookDto.isbn,
        isbn10: updateBookDto.isbn10,
        publisher: updateBookDto.publisher,
        publication_date: updateBookDto.publication_date,
        category: updateBookDto.category,
        library: updateBookDto.library_id
          ? {
              connect: {
                library_id: updateBookDto.library_id,
              },
            }
          : undefined,
        description: updateBookDto.description,
        page_count: updateBookDto.page_count,
        price: updateBookDto.price,
        cover_image_url: updateBookDto.cover_image_url,
        call_number: updateBookDto.call_number,
        ddc: updateBookDto.ddc,
        lcc: updateBookDto.lcc,
        primary_collection: updateBookDto.primary_collection_id
          ? {
              connect: {
                collection_id: updateBookDto.primary_collection_id,
              },
            }
          : undefined,
      },
      include: {
        library: true,
        items: true,
      },
    });
  }

  async remove(book_id: string) {
    const book = await this.prisma.book.findUnique({
      where: { book_id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${book_id} not found`);
    }

    return this.prisma.book.delete({
      where: { book_id },
      include: {
        library: true,
        items: true,
      },
    });
  }

  async search(searchBookDto: SearchBookDto) {
    const { title, author, isbn, category, library_id, limit, offset } =
      searchBookDto;

    const where = {
      ...(title && {
        title: { contains: title, mode: Prisma.QueryMode.insensitive },
      }),
      ...(author && {
        authors: { has: author },
      }),
      ...(isbn && {
        isbn: { contains: isbn, mode: Prisma.QueryMode.insensitive },
      }),
      ...(category && {
        category: { contains: category, mode: Prisma.QueryMode.insensitive },
      }),
      ...(library_id && { library_id }),
    };

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          library: true,
          items: true,
        },
        take: limit,
        skip: offset,
        orderBy: { title: "asc" },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      books,
      total,
      limit,
      offset,
    };
  }

  async getAvailableBooks(library_id: string) {
    const library = await this.prisma.library.findUnique({
      where: { library_id },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${library_id} not found`);
    }

    return this.prisma.book.findMany({
      where: {
        library_id,
        items: {
          some: {
            status: BookStatus.available,
          },
        },
      },
      include: {
        library: true,
        items: {
          where: {
            status: BookStatus.available,
          },
        },
      },
    });
  }

  async getBookCategories() {
    const books = await this.prisma.book.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return books.map((book) => book.category);
  }

  //write a function to get books by library id and search by title, author, isbn, category
  // async searchByLibraryId(
  //   libraryId: string,
  //   searchBookDto: SearchBookDto
  // ): Promise<{ books: Book[]; total: number; limit: number; offset: number }> {
  //   const { title, author, isbn, category, limit, offset } = searchBookDto;

  //   const where = {
  //     library_id: libraryId,
  //     ...(title && {
  //       title: { contains: title, mode: Prisma.QueryMode.insensitive },
  //     }),
  //     ...(author && {
  //       authors: { has: author },
  //     }),
  //     ...(isbn && {
  //       isbn: { contains: isbn, mode: Prisma.QueryMode.insensitive },
  //     }),
  //     ...(category && {
  //       category: { contains: category, mode: Prisma.QueryMode.insensitive },
  //     }),
  //   };

  //   const [books, total] = await Promise.all([
  //     this.prisma.book.findMany({
  //       where,
  //       include: {
  //         library: true,
  //         items: true,
  //       },
  //       take: limit,
  //       skip: offset,
  //       orderBy: { title: "asc" },
  //     }),
  //     this.prisma.book.count({ where }),
  //   ]);

  //   return {
  //     books,
  //     total,
  //     limit,
  //     offset,
  //   };
  // }
  async findByLibrary(libraryId: string) {
    const library = await this.prisma.library.findUnique({
      where: { library_id: libraryId },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${libraryId} not found`);
    }

    return this.prisma.book.findMany({
      where: { library_id: libraryId },
      include: {
        // library: true,
        items: true,
      },
    });
  }
}
