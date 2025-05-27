import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { AlgoliaUserService } from "src/algolia/algolia-user.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private algoliaUserService: AlgoliaUserService
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if college exists
    const college = await this.prisma.college.findUnique({
      where: { college_id: createUserDto.college_id },
    });

    if (!college) {
      throw new NotFoundException(
        `College with ID ${createUserDto.college_id} not found`
      );
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        user_id: uuidv4(),
        ...createUserDto,
        is_active: createUserDto.is_active ?? true,
      },
      include: {
        college: true,
      },
    });
    await this.algoliaUserService.indexUser(user);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        branch: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
      include:{
        college:{
          include:{
            libraries:true,
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return user;
  }

  async update(user_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // If email is being updated, check if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException("Email already exists");
      }
    }

    return this.prisma.user.update({
      where: { user_id },
      data: updateUserDto,
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        branch: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return this.prisma.user.delete({
      where: { user_id },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        branch: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // async changePassword(user_id: string, changePasswordDto: ChangePasswordDto) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { user_id },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${user_id} not found`);
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     changePasswordDto.current_password,
  //     user.password_hash,
  //   );

  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Current password is incorrect');
  //   }

  //   const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, 10);

  //   return this.prisma.user.update({
  //     where: { user_id },
  //     data: { password_hash: hashedPassword },
  //     select: {
  //       user_id: true,
  //       first_name: true,
  //       last_name: true,
  //       email: true,
  //       role: true,
  //       branch: true,
  //       is_active: true,
  //       created_at: true,
  //       updated_at: true,
  //     },
  //   });
  // }

  async findByCollege(college_id: string) {
    const college = await this.prisma.college.findUnique({
      where: { college_id },
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${college_id} not found`);
    }

    return this.prisma.user.findMany({
      where: { college_id },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        branch: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getBorrowedBooks(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
      include: {
        booksIssued: {
          include: {
            item: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return user.booksIssued;
  }

  async getFines(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
      include: {
        fines: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return user.fines;
  }

  async getNotifications(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
      include: {
        notifications: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    return user.notifications;
  }
}
