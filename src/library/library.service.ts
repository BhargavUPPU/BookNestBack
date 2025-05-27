import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async create(createLibraryDto: CreateLibraryDto) {
    // Check if college exists
    const college = await this.prisma.college.findUnique({
      where: { college_id: createLibraryDto.college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${createLibraryDto.college_id} not found`);
    }

    return this.prisma.library.create({
      data: {
        library_id: uuidv4(),
        ...createLibraryDto,
      },
    });
  }

  async findAll() {
    return this.prisma.library.findMany({
      include: {
        college: true,
      },
    });
  }

  async findOne(library_id: string) {
    const library = await this.prisma.library.findUnique({
      where: { library_id },
      include: {
        college: true,
      },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${library_id} not found`);
    }

    return library;
  }

  async update(library_id: string, updateLibraryDto: UpdateLibraryDto) {
    const library = await this.prisma.library.findUnique({
      where: { library_id },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${library_id} not found`);
    }

    // If college_id is being updated, verify the new college exists
    if (updateLibraryDto.college_id) {
      const college = await this.prisma.college.findUnique({
        where: { college_id: updateLibraryDto.college_id },
      });

      if (!college) {
        throw new NotFoundException(`College with ID ${updateLibraryDto.college_id} not found`);
      }
    }

    return this.prisma.library.update({
      where: { library_id },
      data: updateLibraryDto,
      include: {
        college: true,
      },
    });
  }

  async remove(library_id: string) {
    const library = await this.prisma.library.findUnique({
      where: { library_id },
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${library_id} not found`);
    }

    return this.prisma.library.delete({
      where: { library_id },
    });
  }

  async findByCollege(college_id: string) {
    const college = await this.prisma.college.findUnique({
      where: { college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${college_id} not found`);
    }

    return this.prisma.library.findMany({
      where: { college_id },
      include: {
        college: true,
      },
    });
  }
} 