import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create transaction record
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        transaction_id: createTransactionDto.transaction_id || uuidv4(),
        status: createTransactionDto.status || TransactionStatus.pending,
        user: {
          connect: {
            user_id: userId
          }
        }
      },
      include: {
        user: true
      }
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        user: true
      }
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id: id },
      include: {
        user: true
      }
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByUser(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return this.prisma.transaction.findMany({
      where: { user_id },
      include: {
        user: true,
      },
    });
  }

  async updateStatus(id: string, status: TransactionStatus) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id: id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return this.prisma.transaction.update({
      where: { transaction_id: id },
      data: { status },
      include: {
        user: true
      }
    });
  }

  async getTransactionSummary(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const transactions = await this.prisma.transaction.findMany({
      where: { user_id },
    });

    const summary = {
      total_transactions: transactions.length,
      total_amount: transactions.reduce((sum, t) => Number(sum) + Number(t.amount), 0),
      completed_transactions: transactions.filter(t => t.status === TransactionStatus.success).length,
      pending_transactions: transactions.filter(t => t.status === TransactionStatus.pending).length,
      failed_transactions: transactions.filter(t => t.status === TransactionStatus.failed).length,
    };

    return summary;
  }

  async getSummary() {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.success
      }
    });

    const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const count = transactions.length;

    return {
      total,
      count,
      average: count > 0 ? total / count : 0
    };
  }
} 