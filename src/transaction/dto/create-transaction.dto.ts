import { IsString, IsNotEmpty, IsNumber, Min, IsDate, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';
import { TransactionStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  transaction_date?: Date = new Date();

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus = TransactionStatus.pending;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}