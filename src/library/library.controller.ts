import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { LibraryService } from "./library.service";
import { CreateLibraryDto } from "./dto/create-library.dto";
import { UpdateLibraryDto } from "./dto/update-library.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/enums/role.enum";

@Controller("libraries")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  @Roles(Role.admin)
  create(@Body() createLibraryDto: CreateLibraryDto) {
    console.log("POST /libraries reached");
    return this.libraryService.create(createLibraryDto);
  }

  @Get()
  @Roles(Role.admin, Role.librarian)
  findAll() {
    return this.libraryService.findAll();
  }

  @Get("college/:collegeId")
  // @Roles(Role.admin, Role.librarian)
  findByCollege(@Param("collegeId") collegeId: string) {
    return this.libraryService.findByCollege(collegeId);
  }

  @Get(":id")
  @Roles(Role.admin, Role.librarian)
  findOne(@Param("id") id: string) {
    return this.libraryService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.admin)
  update(@Param("id") id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.update(id, updateLibraryDto);
  }

  @Delete(":id")
  @Roles(Role.admin)
  remove(@Param("id") id: string) {
    return this.libraryService.remove(id);
  }
}
