import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookIssuedDto {
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  issued_date?: Date = new Date();
  
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  due_date?: Date;

  @IsString()
  @IsOptional()
  issued_by?: string;
} 