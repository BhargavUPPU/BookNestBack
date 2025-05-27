import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CollegeService {
  constructor(private prisma: PrismaService) {}

  async create(createCollegeDto: CreateCollegeDto) {
    return this.prisma.college.create({
      data: {
        college_id: uuidv4(),
        ...createCollegeDto,
      },
    });
  }

  async findAll() {
    return this.prisma.college.findMany();
  }

  async findOne(college_id: string) {
    const college = await this.prisma.college.findUnique({
      where: { college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${college_id} not found`);
    }

    return college;
  }

  async update(college_id: string, updateCollegeDto: UpdateCollegeDto) {
    const college = await this.prisma.college.findUnique({
      where: { college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${college_id} not found`);
    }

    return this.prisma.college.update({
      where: { college_id },
      data: updateCollegeDto,
    });
  }

  async remove(college_id: string) {
    const college = await this.prisma.college.findUnique({
      where: { college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${college_id} not found`);
    }

    return this.prisma.college.delete({
      where: { college_id },
    });
  }
} 