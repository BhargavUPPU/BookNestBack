import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/types/role.type';
import { TransactionStatus } from './enums/transaction-status.enum';

@Controller('transaction')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(Role.admin, Role.librarian)
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto, Role.librarian);
  }

  @Get()
  @Roles(Role.admin, Role.librarian)
  findAll() {
    return this.transactionService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.admin, Role.librarian)
  findByUser(@Param('userId') userId: string) {
    return this.transactionService.findByUser(userId);
  }

  @Get('summary/:userId')
  @Roles(Role.admin, Role.librarian)
  getTransactionSummary(@Param('userId') userId: string) {
    return this.transactionService.getTransactionSummary(userId);
  }

  @Get(':id')
  @Roles(Role.admin, Role.librarian)
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.admin, Role.librarian)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: TransactionStatus,
  ) {
    return this.transactionService.updateStatus(id, status as any);
  }
} 