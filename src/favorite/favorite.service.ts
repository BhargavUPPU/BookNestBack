import { BadRequestException, Injectable } from "@nestjs/common";
import { Favorite } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}
  async create(createFavoriteDto: CreateFavoriteDto) {
    const { userId, bookId } = createFavoriteDto;
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException(`user with Id ${userId} not found`);
    }
    const book = await this.prisma.book.findUnique({
      where: {
        book_id: bookId,
      },
    });
    if (!book) {
      throw new BadRequestException(`book with Id ${bookId} not found`);
    }
    const favorite = await this.prisma.favorite.create({
      data: {
        favorite_id: uuidv4(),
        user: {
          connect: {
            user_id: userId,
          },
        },
        book: {
          connect: {
            book_id: bookId,
          },
        },
      },
    });
    await this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        favorites_count: {
          increment: 1,
        },
      },
    });
    return favorite;
  }

  async getByUserId(userId: string): Promise<Favorite[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
    return this.prisma.favorite.findMany({
      where: {
        user_id: userId,
      },
      include: {
        book: true,
      },
    });
  }

  async remove(favoriteId: string): Promise<Favorite> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        favorite_id: favoriteId,
      },
    });
    if (!favorite) {
      throw new Error(`Favorite with Id ${favoriteId} not found`);
    }

    await this.prisma.user.update({
      where: {
        user_id: favorite.user_id,
      },
      data: {
        favorites_count: {
          decrement: 1,
        },
      },
    });
    return await this.prisma.favorite.delete({
      where: {
        favorite_id: favoriteId,
      },
    });
  }
}
