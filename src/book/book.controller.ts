import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBookDto } from "./dto/search-book.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/enums/role.enum";
import { Book } from "@prisma/client";

@Controller("books")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  // @Roles(Role.admin, Role.librarian)
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get("search")
  async search(
    @Query() searchBookDto: SearchBookDto
  ): Promise<{ books: Book[]; total: number; limit: number; offset: number }> {
    return this.bookService.search(searchBookDto);
  }

  // @Get("search/library/:libraryId")
  // async searchByLibraryId(
  //   @Param("libraryId") libraryId: string,
  //   @Query() searchBookDto: SearchBookDto
  // ): Promise<{ books: Book[]; total: number; limit: number; offset: number }> {
  //   return this.bookService.searchByLibraryId(libraryId, searchBookDto);
  // }

  @Get("categories")
  async getCategories(): Promise<string[]> {
    return this.bookService.getBookCategories();
  }

  @Get("library/:libraryId")
  async findByLibrary(@Param("libraryId") libraryId: string): Promise<Book[]> {
    return this.bookService.findByLibrary(libraryId);
  }

  @Get("library/:libraryId/available")
  async getAvailableBooks(
    @Param("libraryId") libraryId: string
  ): Promise<Book[]> {
    return this.bookService.getAvailableBooks(libraryId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.admin, Role.librarian)
  async update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<Book> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(":id")
  @Roles(Role.admin)
  async remove(@Param("id") id: string): Promise<Book> {
    return this.bookService.remove(id);
  }
}
