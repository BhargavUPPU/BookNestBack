import { Module } from "@nestjs/common";
import { FirebaseNotificationService } from "./firebase-notification.service";
import { firebaseAdminProvider } from './firebase-admin.provider';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule],
  providers: [firebaseAdminProvider,FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class FirebaseNotificationModule {}
