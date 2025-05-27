import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { PayFineDto } from './dto/pay-fine.dto';
import { v4 as uuidv4 } from 'uuid';
import { FineStatus } from '@prisma/client';
import { FineReason } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FineService {
  constructor(private prisma: PrismaService) {}

  async create(createFineDto: CreateFineDto) {
    // Check if book issued record exists
    const bookIssued = await this.prisma.bookIssued.findUnique({
      where: { issued_id: createFineDto.issued_id },
      include: { user: true },
    });

    if (!bookIssued) {
      throw new NotFoundException(`Book issued record with ID ${createFineDto.issued_id} not found`);
    }

    // Check if fine already exists for this book issued record
    const existingFine = await this.prisma.fine.findFirst({
      where: {
        issued_id: createFineDto.issued_id,
        status: {
          in: [FineStatus.unpaid],
        },
      },
    });

    if (existingFine) {
      throw new BadRequestException('An unpaid fine already exists for this book issued record');
    }

    // Create fine record
    return this.prisma.fine.create({
      data: {
        fine_id: uuidv4(),
        user: {
          connect: {
            user_id: createFineDto.user_id
          }
        },
        issued: {
          connect: {
            issued_id: createFineDto.issued_id
          }
        },
        amount: createFineDto.amount,
        reason: createFineDto.reason || FineReason.overdue,
        status: FineStatus.unpaid
      },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async findAll() {
    return this.prisma.fine.findMany({
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async findOne(fine_id: string) {
    const fine = await this.prisma.fine.findUnique({
      where: { fine_id },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });

    if (!fine) {
      throw new NotFoundException(`Fine with ID ${fine_id} not found`);
    }

    return fine;
  }

  async findByUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return this.prisma.fine.findMany({
      where: { user_id },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async findByBookIssued(issued_id: string) {
    const bookIssued = await this.prisma.bookIssued.findUnique({
      where: { issued_id },
    });

    if (!bookIssued) {
      throw new NotFoundException(`Book issued record with ID ${issued_id} not found`);
    }

    return this.prisma.fine.findMany({
      where: { issued_id },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async update(fine_id: string, updateFineDto: UpdateFineDto) {
    const fine = await this.prisma.fine.findUnique({
      where: { fine_id },
    });

    if (!fine) {
      throw new NotFoundException(`Fine with ID ${fine_id} not found`);
    }

    // If issued_id is being updated, verify the new record exists
    if (updateFineDto.issued_id) {
      const bookIssued = await this.prisma.bookIssued.findUnique({
        where: { issued_id: updateFineDto.issued_id },
      });

      if (!bookIssued) {
        throw new NotFoundException(`Book issued record with ID ${updateFineDto.issued_id} not found`);
      }
    }

    return this.prisma.fine.update({
      where: { fine_id },
      data: {
        amount: updateFineDto.amount,
        reason: updateFineDto.reason,
        status: updateFineDto.status,
        issued: updateFineDto.issued_id ? {
          connect: {
            issued_id: updateFineDto.issued_id
          }
        } : undefined,
        user: updateFineDto.user_id ? {
          connect: {
            user_id: updateFineDto.user_id
          }
        } : undefined
      },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async remove(fine_id: string) {
    const fine = await this.prisma.fine.findUnique({
      where: { fine_id },
    });

    if (!fine) {
      throw new NotFoundException(`Fine with ID ${fine_id} not found`);
    }

    return this.prisma.fine.delete({
      where: { fine_id },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async payFine(payFineDto: PayFineDto) {
    const fine = await this.prisma.fine.findUnique({
      where: { fine_id: payFineDto.fine_id },
    });

    if (!fine) {
      throw new NotFoundException(`Fine with ID ${payFineDto.fine_id} not found`);
    }

    if (fine.status === FineStatus.paid) {
      throw new BadRequestException('Fine has already been paid');
    }

    if (new Decimal(payFineDto.amount_paid).lessThan(fine.amount)) {
      throw new BadRequestException('Payment amount is less than the fine amount');
    }

    // Update fine record
    const updatedFine = await this.prisma.fine.update({
      where: { fine_id: payFineDto.fine_id },
      data: {
        status: FineStatus.paid,
        paid_date: new Date()
      },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });

    return updatedFine;
  }

  async getOverdueFines() {
    return this.prisma.fine.findMany({
      where: {
        status: FineStatus.unpaid,
        reason: FineReason.overdue
      },
      include: {
        issued: {
          include: {
            user: true,
            item: {
              include: {
                book: true,
              },
            },
          },
        },
        user: true
      },
    });
  }

  async calculateOverdueFine(issued_id: string) {
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
      throw new NotFoundException(`Book issued record with ID ${issued_id} not found`);
    }

    if (!bookIssued.due_date) {
      throw new BadRequestException('Book issued record has no due date');
    }

    const now = new Date();
    const dueDate = new Date(bookIssued.due_date);
    const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysOverdue <= 0) {
      return 0;
    }

    // Calculate fine amount (e.g., $1 per day)
    const fineAmount = daysOverdue * 1;

    return {
      daysOverdue,
      fineAmount,
      bookIssued,
    };
  }
} 