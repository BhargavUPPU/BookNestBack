import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookItemService } from './book-item.service';
import { CreateBookItemDto } from './dto/create-book-item.dto';
import { UpdateBookItemDto } from './dto/update-book-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { BookStatus } from './enums/book-item-status.enum';

@Controller('book-items')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class BookItemController {
  constructor(private readonly bookItemService: BookItemService) {}

  @Post()
  // @Roles(Role.admin, Role.librarian)
  create(@Body() createBookItemDto: CreateBookItemDto) {
    return this.bookItemService.create(createBookItemDto);
  }

  @Get()
  findAll() {
    return this.bookItemService.findAll();
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId') bookId: string) {
    return this.bookItemService.findByBook(bookId);
  }

  // @Get('status/:status')
  // findByStatus(@Param('status') status: BookStatus) {
  //   return this.bookItemService.findByStatus(status);
  // }

  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string) {
    return this.bookItemService.findByBarcode(barcode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookItemService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin, Role.librarian)
  update(@Param('id') id: string, @Body() updateBookItemDto: UpdateBookItemDto) {
    return this.bookItemService.update(id, updateBookItemDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.bookItemService.remove(id);
  }
} 