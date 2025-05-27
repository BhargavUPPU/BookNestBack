import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCollectionDto, UpdateCollectionDto } from "./dto/collection.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async createCollection(createCollectionDto: CreateCollectionDto) {
    const collection = await this.prisma.collection.create({
      data: {
        collection_id: uuidv4(),
        ...createCollectionDto,
      },
      include: {
        // collectionBook: {
        //   include: {
        //     book: true,
        //   },
        // },
        library: true,
      },
    });
    return collection;
  }

  async getAllCollections() {
    const collections = await this.prisma.collection.findMany({
      include: {
        // collectionBooks: {
        //   include: {
        //     book: true,
        //   },
        // },
        library: true,
      },
    });
    return collections;
  }

  async getCollectionById(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { collection_id: id },
      include: {
        // collectionBooks: {
        //   include: {
        //     book: true,
        //   },
        // },
        primary_books: true,
        books: true,
        library: true,
      },
    });
    if (!collection) {
      throw new BadRequestException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async getCollectionsByLibrary(libraryId: string) {
    const collections = await this.prisma.collection.findMany({
      where: { library_id: libraryId },
      // include: {
      //   collectionBooks: {
      //     include: {
      //       book: true,
      //     },
      //   },
      //},
    });
    if (!collections) {
      throw new BadRequestException(
        `No collections found for library with ID ${libraryId}`
      );
    }
    return collections;
  }

  async updateCollection(id: string, updateCollectionDto: UpdateCollectionDto) {
    const collection = await this.prisma.collection.update({
      where: { collection_id: id },
      data: updateCollectionDto,
      // include: {
      //   collectionBooks: {
      //     include: {
      //       book: true,
      //     },
      //   },
      //   library: true,
      // },
    });
    return collection;
  }

  async deleteCollection(id: string) {
    const collection = await this.prisma.collection.delete({
      where: { collection_id: id },
    });
    return collection;
  }

  async addBookToCollection(collectionId: string, bookId: string) {
    // Check if ISBN already exists
    const existingBook = await this.prisma.collectionBook.findUnique({
      where: {
        collection_id_book_id: { collection_id: collectionId, book_id: bookId },
      },
    });

    if (existingBook) {
      throw new BadRequestException("Book already exists in this collection");
    }
    const collectionBook = await this.prisma.collectionBook.create({
      data: {
        collection_book_id: uuidv4(),
        collection_id: collectionId,
        book_id: bookId,
      },
      include: {
        book: true,
        collection: {
          include: {
            library: true,
          },
        },
      },
    });
    return collectionBook;
  }

  async removeBookFromCollection(collectionId: string, bookId: string) {
    const collectionBook = await this.prisma.collectionBook.delete({
      where: {
        collection_id_book_id: {
          collection_id: collectionId,
          book_id: bookId,
        },
      },
    });
    return collectionBook;
  }
}
