import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';

@Controller('collections')
// @UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.createCollection(createCollectionDto);
  }

  @Get()
  async getAllCollections() {
    return this.collectionService.getAllCollections();
  }

  @Get(':id')
  async getCollectionById(@Param('id') id: string) {
    return this.collectionService.getCollectionById(id);
  }

  @Get('library/:libraryId')
  async getCollectionsByLibrary(@Param('libraryId') libraryId: string) {
    return this.collectionService.getCollectionsByLibrary(libraryId);
  }

  @Put(':id')
  async updateCollection(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.updateCollection(id, updateCollectionDto);
  }

  @Delete(':id')
  async deleteCollection(@Param('id') id: string) {
    return this.collectionService.deleteCollection(id);
  }

  @Post(':collectionId/books/:bookId')
  async addBookToCollection(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.collectionService.addBookToCollection(collectionId, bookId);
  }

  @Delete(':collectionId/books/:bookId')
  async removeBookFromCollection(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.collectionService.removeBookFromCollection(collectionId, bookId);
  }
} 