// src/algolia/algolia-book.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { ConfigService } from '@nestjs/config';
// import { Book } from '@prisma/client';

@Injectable()
export class AlgoliaBookService implements OnModuleInit {
  private readonly indexName = `books_${process.env.NODE_ENV || 'development'}`;
  private readonly client: SearchClient;
  private readonly index: SearchIndex;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('ALGOLIA_APP_ID');
    const apiKey = this.configService.get<string>('ALGOLIA_ADMIN_KEY');

    this.client = algoliasearch(appId, apiKey);
    this.index = this.client.initIndex(this.indexName);
  }

  async onModuleInit() {
    try {
      await Promise.race([
        this.index.setSettings({
          searchableAttributes: [
            'title',
            'authors',
            'isbn',
            'isbn10',
            'publisher',
            'category',
            'description',
            'call_number',
            'ddc',
            'lcc',
          ],
          attributesForFaceting: [
            'category',
            'searchable(publisher)',
            'searchable(authors)',
            'price',
            'page_count',
              'library_id'
          ],
          customRanking: ['desc(publication_date)', 'desc(page_count)'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Algolia timeout after 5s')), 5000)
        ),
      ]);
      console.log('[Algolia] Index initialized successfully.');
    } catch (error) {
      console.error('[Algolia] Failed to initialize index:', error.message);
    }
  }

  // ✅ Add this to transform Book object into Algolia format
  private transformBookRecord(book: any) {
    return {
      objectID: book.book_id, // Required by Algolia
      title: book.title,
      authors: book.authors,
      isbn: book.isbn,
      isbn10: book.isbn10,
      publisher: book.publisher,
      publication_date: book.publication_date?.getTime() || null,
      category: book.category,
      description: book.description,
      page_count: book.page_count,
      price: book.price,
      cover_image_url: book.cover_image_url,
      call_number: book.call_number,
      ddc: book.ddc,
      lcc: book.lcc,
      library_id: book.library_id, // Added library_id field
      _tags: [
        `category:${book.category}`,
        ...(book.ddc ? [`ddc:${book.ddc}`] : []),
        ...(book.lcc ? [`lcc:${book.lcc}`] : []),
      ],
    };
  }

  // ✅ Add this method to allow indexing a book
  public async indexBook(book: any): Promise<void> {
    const record = this.transformBookRecord(book);
    await this.index.saveObject(record);
  }
}
