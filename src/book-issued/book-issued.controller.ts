import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { BookIssuedService } from "./book-issued.service";
import { CreateBookIssuedDto } from "./dto/create-book-issued.dto";
import { UpdateBookIssuedDto } from "./dto/update-book-issued.dto";
import { ReturnBookDto } from "./dto/return-book.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/enums/role.enum";

@Controller("book-issued")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class BookIssuedController {
  constructor(private readonly bookIssuedService: BookIssuedService) {}

  @Post("issue")
  // @Roles(Role.admin, Role.librarian)
  issueBook(@Body() createBookIssuedDto: CreateBookIssuedDto) {
    return this.bookIssuedService.issueBook(createBookIssuedDto);
  }

  @Post("return")
  // @Roles(Role.admin, Role.librarian)
  returnBook(@Body() returnBookDto: ReturnBookDto) {
    return this.bookIssuedService.returnBook(returnBookDto);
  }

  @Post("return/:id")
  returnBookByIssueId(@Param("id") id: string) {
    return this.bookIssuedService.returnBookByIssuedId(id);
  }

  @Get()
  findAll() {
    return this.bookIssuedService.findAll();
  }

  @Get("library/:libraryId")
  findByLibrary(@Param("libraryId") libraryId: string) {
    return this.bookIssuedService.findByLibrary(libraryId);
  }

  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return this.bookIssuedService.findByUser(userId);
  }

  @Get("book-item/:bookItemId")
  findByBookItem(@Param("bookItemId") bookItemId: string) {
    return this.bookIssuedService.findByBookItem(bookItemId);
  }

  @Get("overdue")
  getOverdueBooks() {
    return this.bookIssuedService.getOverdueBooks();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookIssuedService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.admin, Role.librarian)
  update(
    @Param("id") id: string,
    @Body() updateBookIssuedDto: UpdateBookIssuedDto
  ) {
    return this.bookIssuedService.update(id, updateBookIssuedDto);
  }

  @Delete(":id")
  @Roles(Role.admin)
  remove(@Param("id") id: string) {
    return this.bookIssuedService.remove(id);
  }
}
