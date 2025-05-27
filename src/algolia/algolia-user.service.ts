// src/algolia/algolia-user.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AlgoliaUserService implements OnModuleInit {
  private readonly indexName = `users_${process.env.NODE_ENV || 'development'}`;
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
            'first_name',
            'last_name',
            'email',
            'branch',
            'college_name'
          ],
          attributesForFaceting: [
            'college_id',
            'role',
            'branch',
            'is_active'
          ],
          customRanking: ['desc(max_books_allowed)'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Algolia timeout after 5s')), 5000)
        ),
      ]);
      console.log('[Algolia] User index initialized successfully.');
    } catch (error) {
      console.error('[Algolia] Failed to initialize user index:', error.message);
    }
  }

  // 🔄 Transforms a user object for Algolia
  private transformUserRecord(user: User) {
    return {
      objectID: user.user_id, // Required
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      max_books_allowed: user.max_books_allowed,
      is_active: user.is_active,
      college_id: user.college_id,
      _tags: [
        `role:${user.role}`,
        ...(user.branch ? [`branch:${user.branch}`] : []),
      ],
    };
  }

  // 🚀 Index a single user
  public async indexUser(user: any): Promise<void> {
    const record = this.transformUserRecord(user);
    await this.index.saveObject(record);
  }

  // 🧹 Optional: Delete user from index
  public async deleteUser(userId: string): Promise<void> {
    await this.index.deleteObject(userId);
  }
}
