import { IsString, IsNotEmpty, IsDate, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { WaitingStatus } from '@prisma/client';

export class CreateWaitingListDto {
  @IsString()
  @IsNotEmpty()
  book_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  library_id: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  request_date?: Date = new Date();

  @IsInt()
  @IsOptional()
  priority?: number = 0;

  @IsEnum(WaitingStatus)
  @IsOptional()
  status?: WaitingStatus = WaitingStatus.pending;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expires_at?: Date;
} 