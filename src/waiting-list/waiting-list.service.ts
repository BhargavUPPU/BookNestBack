import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWaitingListDto } from "./dto/create-waiting-list.dto";
import { UpdateWaitingListDto } from "./dto/update-waiting-list.dto";
import { v4 as uuidv4 } from "uuid";
import { WaitingStatus } from "@prisma/client";
import { BookStatus } from "@prisma/client";

@Injectable()
export class WaitingListService {
  constructor(private prisma: PrismaService) {}

  async create(createWaitingListDto: CreateWaitingListDto) {
    // Check if book exists
    const book = await this.prisma.book.findUnique({
      where: { book_id: createWaitingListDto.book_id },
    });

    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createWaitingListDto.book_id} not found`
      );
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { user_id: createWaitingListDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createWaitingListDto.user_id} not found`
      );
    }

    // Check if user already has a pending/active request for this book
    const existingRequest = await this.prisma.waitingList.findFirst({
      where: {
        book_id: createWaitingListDto.book_id,
        user_id: createWaitingListDto.user_id,
        status: {
          in: [WaitingStatus.pending, WaitingStatus.notified],
        },
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        "User already has a pending/active request for this book"
      );
    }

    // Check if there are available copies
    const availableCopies = await this.prisma.bookItem.count({
      where: {
        book_id: createWaitingListDto.book_id,
        status: BookStatus.available,
      },
    });

    if (availableCopies > 0) {
      throw new BadRequestException(
        "Book is available for immediate borrowing"
      );
    }
    //check if bookissed exists to the same user
    // const bookIssued = await this.prisma.bookIssued.findFirst({
    //   where: {
    //     item:{
    //       book_id: createWaitingListDto.book_id,
    //     },
    //     user_id: createWaitingListDto.user_id,
    //     status: {
    //       in: ["active", "overdue"],
    //     },
    //   },
    // });

    // if (bookIssued) {
    //   throw new BadRequestException(
    //     "User already has an active or overdue book issued"
    //   );
    // }

    // Create waiting list entry
    return this.prisma.waitingList.create({
      data: {
        waiting_id: uuidv4(),
        user: { connect: { user_id: createWaitingListDto.user_id } },
        book: { connect: { book_id: createWaitingListDto.book_id } },
        library: { connect: { library_id: createWaitingListDto.library_id } },
        request_date: new Date(),
        priority: 0,
        status: WaitingStatus.pending,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.waitingList.findMany({
      include: {
        book: true,
        user: true,
      },
    });
  }

  async findOne(waiting_id: string) {
    const waitingList = await this.prisma.waitingList.findUnique({
      where: { waiting_id },
      include: {
        book: true,
        user: true,
      },
    });

    if (!waitingList) {
      throw new NotFoundException(
        `Waiting list entry with ID ${waiting_id} not found`
      );
    }

    return waitingList;
  }

  async findByBook(book_id: string) {
    const book = await this.prisma.book.findUnique({
      where: { book_id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${book_id} not found`);
    }

    return this.prisma.waitingList.findMany({
      where: { book_id },
      include: {
        book: true,
        user: true,
      },
      orderBy: {
        request_date: "asc",
      },
    });
  }

  async findByUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return this.prisma.waitingList.findMany({
      where: { user_id },
      include: {
        book: true,
        // user: true,
      },
    });
  }

  async update(waiting_id: string, updateWaitingListDto: UpdateWaitingListDto) {
    const waitingList = await this.prisma.waitingList.findUnique({
      where: { waiting_id },
    });

    if (!waitingList) {
      throw new NotFoundException(
        `Waiting list entry with ID ${waiting_id} not found`
      );
    }

    // If book_id is being updated, verify the new book exists
    if (updateWaitingListDto.book_id) {
      const book = await this.prisma.book.findUnique({
        where: { book_id: updateWaitingListDto.book_id },
      });

      if (!book) {
        throw new NotFoundException(
          `Book with ID ${updateWaitingListDto.book_id} not found`
        );
      }
    }

    // If user_id is being updated, verify the new user exists
    if (updateWaitingListDto.user_id) {
      const user = await this.prisma.user.findUnique({
        where: { user_id: updateWaitingListDto.user_id },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateWaitingListDto.user_id} not found`
        );
      }
    }

    return this.prisma.waitingList.update({
      where: { waiting_id },
      data: updateWaitingListDto,
      include: {
        book: true,
        user: true,
      },
    });
  }

  async remove(waiting_id: string) {
    const waitingList = await this.prisma.waitingList.findUnique({
      where: { waiting_id },
    });

    if (!waitingList) {
      throw new NotFoundException(
        `Waiting list entry with ID ${waiting_id} not found`
      );
    }

    return this.prisma.waitingList.delete({
      where: { waiting_id },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async getNextInLine(book_id: string) {
    return this.prisma.waitingList.findFirst({
      where: {
        book_id,
        status: WaitingStatus.notified,
      },
      include: {
        book: true,
        user: true,
      },
      orderBy: {
        request_date: "asc",
      },
    });
  }

  async checkExpiredRequests() {
    const now = new Date();
    const expiredRequests = await this.prisma.waitingList.findMany({
      where: {
        status: {
          in: [WaitingStatus.pending, WaitingStatus.notified],
        },
        expires_at: {
          lt: now,
        },
      },
    });

    for (const request of expiredRequests) {
      await this.prisma.waitingList.update({
        where: { waiting_id: request.waiting_id },
        data: { status: WaitingStatus.cancelled },
      });
    }

    return expiredRequests;
  }
}
