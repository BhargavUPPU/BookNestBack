import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { PayFineDto } from './dto/pay-fine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/types/role.type';

@Controller('fine')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  @Roles(Role.admin, Role.librarian)
  create(@Body() createFineDto: CreateFineDto) {
    return this.fineService.create(createFineDto);
  }

  @Get()
  @Roles(Role.admin, Role.librarian)
  findAll() {
    return this.fineService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.admin, Role.librarian)
  findByUser(@Param('userId') userId: string) {
    return this.fineService.findByUser(userId);
  }

  @Get('book-issued/:bookIssuedId')
  @Roles(Role.admin, Role.librarian)
  findByBookIssued(@Param('bookIssuedId') bookIssuedId: string) {
    return this.fineService.findByBookIssued(bookIssuedId);
  }

  @Get('overdue')
  @Roles(Role.admin, Role.librarian)
  getOverdueFines() {
    return this.fineService.getOverdueFines();
  }

  @Get('calculate/:bookIssuedId')
  @Roles(Role.admin, Role.librarian)
  calculateOverdueFine(@Param('bookIssuedId') bookIssuedId: string) {
    return this.fineService.calculateOverdueFine(bookIssuedId);
  }

  @Get(':id')
  @Roles(Role.admin, Role.librarian)
  findOne(@Param('id') id: string) {
    return this.fineService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin, Role.librarian)
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.fineService.update(id, updateFineDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.fineService.remove(id);
  }

  @Post('pay')
  @Roles(Role.admin, Role.librarian)
  payFine(@Body() payFineDto: PayFineDto) {
    return this.fineService.payFine(payFineDto);
  }
} 