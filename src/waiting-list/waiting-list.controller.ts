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
import { WaitingListService } from "./waiting-list.service";
import { CreateWaitingListDto } from "./dto/create-waiting-list.dto";
import { UpdateWaitingListDto } from "./dto/update-waiting-list.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/enums/role.enum";

@Controller("waiting-list")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post()
  // @Roles(Role.admin, Role.librarian, Role.student)
  create(@Body() createWaitingListDto: CreateWaitingListDto) {
    return this.waitingListService.create(createWaitingListDto);
  }

  @Get()
  findAll() {
    return this.waitingListService.findAll();
  }

  @Get("book/:bookId")
  findByBook(@Param("bookId") bookId: string) {
    return this.waitingListService.findByBook(bookId);
  }

  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return this.waitingListService.findByUser(userId);
  }

  @Get("book/:bookId/next")
  @Roles(Role.admin, Role.librarian)
  getNextInLine(@Param("bookId") bookId: string) {
    return this.waitingListService.getNextInLine(bookId);
  }

  @Get("expired")
  @Roles(Role.admin, Role.librarian)
  checkExpiredRequests() {
    return this.waitingListService.checkExpiredRequests();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.waitingListService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.admin, Role.librarian)
  update(
    @Param("id") id: string,
    @Body() updateWaitingListDto: UpdateWaitingListDto
  ) {
    return this.waitingListService.update(id, updateWaitingListDto);
  }

  @Delete(":id")
  @Roles(Role.admin, Role.librarian)
  remove(@Param("id") id: string) {
    return this.waitingListService.remove(id);
  }
}
