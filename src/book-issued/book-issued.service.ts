import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookIssuedDto } from "./dto/create-book-issued.dto";
import { UpdateBookIssuedDto } from "./dto/update-book-issued.dto";
import { ReturnBookDto } from "./dto/return-book.dto";
import { v4 as uuidv4 } from "uuid";
import { BookStatus, NotificationType } from "@prisma/client";
import { FirebaseNotificationService } from "../firebase/firebase-notification.service";
import { IssueStatus } from "@prisma/client";

@Injectable()
export class BookIssuedService {
  constructor(
    private prisma: PrismaService,
    private firebaseNotificationService: FirebaseNotificationService
  ) {}

  async issueBook(createBookIssuedDto: CreateBookIssuedDto) {
    // Check if book item exists and is available
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { item_id: createBookIssuedDto.item_id },
      include: { book: true },
    });

    if (!bookItem) {
      throw new NotFoundException(
        `Book item with ID ${createBookIssuedDto.item_id} not found`
      );
    }

    if (bookItem.status !== BookStatus.available) {
      throw new BadRequestException("Book item is not available for borrowing");
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { user_id: createBookIssuedDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createBookIssuedDto.user_id} not found`
      );
    }

    // Check if user has reached borrowing limit
    const borrowedBooks = await this.prisma.bookIssued.count({
      where: {
        user_id: createBookIssuedDto.user_id,
        return_date: null,
      },
    });

    if (borrowedBooks >= 5) {
      // Assuming max 5 books per user
      throw new BadRequestException(
        "User has reached the maximum borrowing limit"
      );
    }
    //check issuesing the same book
    const issuedBook = await this.prisma.bookIssued.findFirst({
      where: {
        user_id: createBookIssuedDto.user_id,
        item_id: createBookIssuedDto.item_id,
        return_date: null,
      },
    });
    if (issuedBook) {
      throw new BadRequestException("User has already issued this book");
    }

    //check if issussing the same book of different edition
    const issuedBookOfSameEdition = await this.prisma.bookIssued.findFirst({
      where: {
        user_id: createBookIssuedDto.user_id,
        item: {
          book: {
            book_id: bookItem.book.book_id,
          },
        },
        return_date: null,
      },
    });
    if (issuedBookOfSameEdition) {
      throw new BadRequestException(
        "User has already issued a book of this edition"
      );
    }

    // Create book issued record
    const bookIssued = await this.prisma.bookIssued.create({
      data: {
        issued_id: uuidv4(),
        item_id: createBookIssuedDto.item_id,
        user_id: createBookIssuedDto.user_id,
        issued_date: new Date(),
        due_date:
          createBookIssuedDto.due_date ||
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
        status: IssueStatus.active,
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });

    // Update book item status
    await this.prisma.bookItem.update({
      where: { item_id: createBookIssuedDto.item_id },
      data: { status: BookStatus.checked_out },
    });

    // send notification to user
    // await this.prisma.notification.create({
    //   data: {
    //     notification_id: uuidv4(),
    //     user: {
    //       connect: { user_id: createBookIssuedDto.user_id },
    //     },
    //     message: `you have issued a book with title ${bookItem.book.title}`,
    //     type: NotificationType.general,
    //     is_read: false,
    //     metadata: {
    //       issued_id: bookIssued.issued_id,
    //       book_item_id: createBookIssuedDto.item_id,
    //       book_title: bookItem.book.title,
    //       issued_date: bookIssued.issued_date,
    //       due_date: bookIssued.due_date,
    //     },
    //   },
    // });

    await this.prisma.user.update({
      where: { user_id: createBookIssuedDto.user_id },
      data: {
        issued_book_count: {
          increment: 1,
        },
      },
    });
    //send notification to user
    const token = await this.prisma.fcm_token.findFirst({
      where: { user_id: createBookIssuedDto.user_id },
    });

    if (token) {
      await this.firebaseNotificationService.sendPush({
        title: "Book Issued",
        body: `You have issued a book with title ${bookItem.book.title}`,
        deviceId: token.token,
      });
    }
    return bookIssued;
  }

  async findAll() {
    return this.prisma.bookIssued.findMany({
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });
  }
  //find all issued books by library id
  async findAllByLibrary(library_id: string) {
    return this.prisma.bookIssued.findMany({
      where: {
        item: {
          book: {
            library_id,
          },
        },
        return_date: null,
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });
  }

  // Find book issued record by ID
  async findOne(issued_id: string) {
    const bookIssued = await this.prisma.bookIssued.findUnique({
      where: { issued_id },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });

    if (!bookIssued) {
      throw new NotFoundException(
        `Book issued record with ID ${issued_id} not found`
      );
    }

    return bookIssued;
  }

  // Find book issued record by user ID
  async findByUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return this.prisma.bookIssued.findMany({
      where: { user_id },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });
  }

  async update(issued_id: string, updateBookIssuedDto: UpdateBookIssuedDto) {
    return this.prisma.bookIssued.update({
      where: { issued_id },
      data: updateBookIssuedDto,
    });
  }

  // Find book issued record by book item ID
  async findByBookItem(item_id: string) {
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { item_id },
    });

    if (!bookItem) {
      throw new NotFoundException(`Book item with ID ${item_id} not found`);
    }

    return this.prisma.bookIssued.findMany({
      where: { item_id },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        // user: true,
      },
    });
  }

  async findByLibrary(library_id: string) {
    const library = await this.prisma.library.findUnique({
      where: { library_id },
    });
    if (!library) {
      throw new NotFoundException(`Library with ID ${library_id} not found`);
    }
    return this.prisma.bookIssued.findMany({
      where: {
        status: {
          not: "returned",
        },
        item: {
          is: {
            book: {
              is: {
                library_id: library_id,
              },
            },
          },
        },
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    //return book Barcode
    const bookItem = await this.prisma.bookItem.findUnique({
      where: { barcode: returnBookDto.Barcode },
      include: { book: true },
    });
    if (!bookItem) {
      throw new NotFoundException(
        `Book item with Barcode ${returnBookDto.Barcode} not found`
      );
    }

    // Check if book issued record exists
    const bookIssued = await this.prisma.bookIssued.findFirst({
      where: {
        item_id: bookItem.item_id,
        return_date: null,
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });

    // const bookIssued = await this.prisma.bookIssued.findUnique({
    //   where: { issued_id: returnBookDto.issued_id },
    //   include: { item: true },
    // });

    if (!bookIssued) {
      throw new NotFoundException(
        `Book issued record with ID ${returnBookDto.Barcode} not found`
      );
    }

    if (bookIssued.return_date) {
      throw new BadRequestException("Book has already been returned");
    }

    // Update book issued record
    const updatedBookIssued = await this.prisma.bookIssued.update({
      where: { issued_id: bookIssued.issued_id },
      data: {
        return_date: returnBookDto.return_date || new Date(),
        status: IssueStatus.returned,
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });

    // Update book item status
    await this.prisma.bookItem.update({
      where: { item_id: bookIssued.item_id },
      data: { status: BookStatus.available },
    });

    await this.prisma.user.update({
      where: { user_id: bookIssued.user_id },
      data: {
        issued_book_count: {
          decrement: 1,
        },
      },
    });
    //send notification to user
    const token = await this.prisma.fcm_token.findFirst({
      where: { user_id: bookIssued.user_id },
    });
    if (token) {
      await this.firebaseNotificationService.sendPush({
        title: "Book Returned",
        body: `You have returned the book with title "${bookItem.book.title}"`,
        deviceId: token.token,
      });
    }
    // Notify users in the waiting list
    await this.notifyWaitingList(bookItem);
    return updatedBookIssued;
  }

  async returnBookByIssuedId(issued_id: string,) {
  
    const bookIssued = await this.prisma.bookIssued.findUnique({
      where: { issued_id:issued_id },
      include: { item: true },
    });

    if (!bookIssued) {
      throw new NotFoundException(`Book issued record with ID  not found`);
    }

    if (bookIssued.return_date) {
      throw new BadRequestException('Book has already been returned');
    }

    // Update book issued record
    const updatedBookIssued = await this.prisma.bookIssued.update({
      where: { issued_id: bookIssued.issued_id },
      data: {
        return_date: new Date(),
        status: IssueStatus.returned
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });

    // Update book item status
    await this.prisma.bookItem.update({
      where: { item_id: bookIssued.item_id },
      data: { status: BookStatus.available },
    });   await this.prisma.user.update({
      where: { user_id: bookIssued.user_id },
      data: {
        issued_book_count: {
          decrement: 1,
        },
      },
    });
    //send notification to user
    const token = await this.prisma.fcm_token.findFirst({
      where: { user_id: bookIssued.user_id },
    });
    if (token) {
      await this.firebaseNotificationService.sendPush({
        title: "Book Returned",
        body: `You have returned the book with title "${updatedBookIssued.item.book.title}"`,
        deviceId: token.token,
      });
    }
    // Notify users in the waiting list
    await this.notifyWaitingList(updatedBookIssued.item);

    return updatedBookIssued;
  }

  // Notify users in the waiting list
  private async notifyWaitingList(bookItem) {
    const waitingListEntries = await this.prisma.waitingList.findMany({
      where: {
        book_id: bookItem.book.book_id,
        status: "pending",
      },
      include: {
        user: true,
      },
    });

    if (waitingListEntries.length === 0) {
      return;
    }

    for (const entry of waitingListEntries) {
      // Update waiting list status to notified
      await this.prisma.waitingList.update({
        where: { waiting_id: entry.waiting_id },
        data: { status: "notified" },
      });

      // Send notification to user
      const token = await this.prisma.fcm_token.findFirst({
        where: { user_id: entry.user.user_id },
      });

      if (token) {
        await this.firebaseNotificationService.sendPush({
          title: "Book Available",
          body: `The book "${bookItem.book.title}" is now available for borrowing.`,
          deviceId: token.token,
        });
      }
    }

    // Optionally, you can remove the waiting list entries after notifying
    // await this.prisma.waitingList.deleteMany({
    //   where: {
    //     book_id: bookItem.book.book_id,
    //     status: "notified",
    //   },
    // });
  }

  async getOverdueBooks() {
    const now = new Date();
    return this.prisma.bookIssued.findMany({
      where: {
        return_date: null,
        due_date: {
          lt: now,
        },
        status: IssueStatus.active,
      },
      include: {
        item: {
          include: {
            book: true,
          },
        },
        user: true,
      },
    });
  }

  // Remove book issued record
  async remove(issued_id: string) {
    return this.prisma.bookIssued.delete({
      where: { issued_id },
    });
  }
}
