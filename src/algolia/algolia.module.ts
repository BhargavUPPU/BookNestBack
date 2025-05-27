import { Module } from '@nestjs/common';
import { AlgoliaBookService } from './algolia-book.service';
import { AlgoliaUserService } from './algolia-user.service';
@Module({
  providers: [AlgoliaBookService,AlgoliaUserService],
  exports: [AlgoliaBookService,AlgoliaUserService]
})
export class AlgoliaModule {}
