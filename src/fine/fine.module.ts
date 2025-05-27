import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FineController],
  providers: [FineService, PrismaService],
  exports: [FineService],
})
export class FineModule {} 