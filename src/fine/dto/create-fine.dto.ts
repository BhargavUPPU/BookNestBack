import { IsString, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { FineStatus } from '@prisma/client';
import { FineReason } from '@prisma/client';

export class CreateFineDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  issued_id: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(FineReason)
  reason: FineReason;

  @IsEnum(FineStatus)
  status: FineStatus;
} 