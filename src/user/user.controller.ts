import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Roles(Role.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.admin, Role.librarian)
  findAll() {
    return this.userService.findAll();
  }

  @Get('college/:collegeId')
  @Roles(Role.admin, Role.librarian)
  findByCollege(@Param('collegeId') collegeId: string) {
    return this.userService.findByCollege(collegeId);
  }

  @Get(':id')
  @Roles(Role.admin, Role.librarian)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // @Post(':id/change-password')
  // async changePassword(
  //   @Param('id') id: string,
  //   @Body() changePasswordDto: ChangePasswordDto,
  //   @Request() req,
  // ) {
  //   // Only allow users to change their own password or admins to change any password
  //   if (req.user.role !== Role.admin && req.user.user_id !== id) {
  //     throw new Error('You can only change your own password');
  //   }
  //   return this.userService.changePassword(id, changePasswordDto);
  // }

  @Get(':id/borrowed-books')
  // @Roles(Role.admin, Role.librarian)
  getBorrowedBooks(@Param('id') id: string) {
    return this.userService.getBorrowedBooks(id);
  }

  @Get(':id/fines')
  @Roles(Role.admin, Role.librarian)
  getFines(@Param('id') id: string) {
    return this.userService.getFines(id);
  }

  @Get(':id/notifications')
  async getNotifications(@Param('id') id: string, @Request() req) {
    // Only allow users to view their own notifications or admins/librarians to view any
    if (req.user.role !== Role.admin && req.user.role !== Role.librarian && req.user.user_id !== id) {
      throw new Error('You can only view your own notifications');
    }
    return this.userService.getNotifications(id);
  }
} 