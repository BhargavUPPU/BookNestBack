import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AlgoliaUserService } from 'src/algolia/algolia-user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService,AlgoliaUserService],
  exports: [UserService],
})
export class UserModule {} 