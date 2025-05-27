import { Module } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CollegeController],
  providers: [CollegeService, PrismaService],
  exports: [CollegeService],
})
export class CollegeModule {} 