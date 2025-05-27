import { Module } from '@nestjs/common';
import { BookItemService } from './book-item.service';
import { BookItemController } from './book-item.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BookItemController],
  providers: [BookItemService, PrismaService],
  exports: [BookItemService],
})
export class BookItemModule {} 