import { IsString, IsNotEmpty, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PayFineDto {
  @IsString()
  @IsNotEmpty()
  fine_id: string;

  @IsNumber()
  @Min(0)
  amount_paid: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  payment_date?: Date;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 