import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';

@Controller('colleges')
// @UseGuards(JwtAuthGuard)
// @UseGuards(RolesGuard)
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
//   @Roles(Role.admin)
  create(@Body() createCollegeDto: CreateCollegeDto) {
    return this.collegeService.create(createCollegeDto);
  }

  @Get()
  // @Roles(Role.admin, Role.librarian)
  findAll() {
    return this.collegeService.findAll();
  }

  @Get(':id')
  // @Roles(Role.admin, Role.librarian)
  findOne(@Param('id') id: string) {
    return this.collegeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  update(@Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto) {
    return this.collegeService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.collegeService.remove(id);
  }
} 