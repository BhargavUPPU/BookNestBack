import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CollegeModule } from "./college/college.module";
import { LibraryModule } from "./library/library.module";
import { UserModule } from "./user/user.module";
import { BookModule } from "./book/book.module";
import { BookItemModule } from "./book-item/book-item.module";
import { BookIssuedModule } from "./book-issued/book-issued.module";
import { WaitingListModule } from "./waiting-list/waiting-list.module";
import { FineModule } from "./fine/fine.module";
import { TransactionModule } from "./transaction/transaction.module";
import { NotificationModule } from "./notification/notification.module";
import { CollectionModule } from "./collection/collection.module";
import { AlgoliaModule } from "./algolia/algolia.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { FirebaseNotificationModule } from "./firebase/firebase-notification.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AlgoliaModule,
    FirebaseNotificationModule,
    CollegeModule,
    LibraryModule,
    UserModule,
    BookModule,
    BookItemModule,
    BookIssuedModule,
    WaitingListModule,
    FineModule,
    TransactionModule,
    NotificationModule,
    CollectionModule,
    FavoriteModule
  ],
})
export class AppModule {}
