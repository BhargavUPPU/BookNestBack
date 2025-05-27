import { Module } from '@nestjs/common';
import { BookIssuedService } from './book-issued.service';
import { BookIssuedController } from './book-issued.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseNotificationService } from 'src/firebase/firebase-notification.service';
import { firebaseAdminProvider } from 'src/firebase/firebase-admin.provider';

@Module({
  controllers: [BookIssuedController],
  providers: [BookIssuedService, PrismaService,FirebaseNotificationService,firebaseAdminProvider],
  exports: [BookIssuedService],
})
export class BookIssuedModule {} 