import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { BookStatus } from '@prisma/client';
import { BookCondition } from '@prisma/client';

export class CreateBookItemDto {
  @IsString()
  @IsNotEmpty()
  book_id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  barcode: string;

  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus = BookStatus.available;

  @IsEnum(BookCondition)
  @IsOptional()
  condition?: BookCondition = BookCondition.new;

} 