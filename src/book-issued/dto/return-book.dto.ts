import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReturnBookDto {
  // @IsString()
  // @IsNotEmpty()
  // issued_id: string;

  @IsString()
  @IsNotEmpty()
  Barcode: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  return_date?: Date = new Date();

  @IsString()
  @IsOptional()
  returned_by?: string;

  @IsString()
  @IsOptional()
  condition?: string;
} 