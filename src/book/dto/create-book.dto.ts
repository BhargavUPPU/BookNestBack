import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsUrl,
  IsOptional,
  IsArray,
  IsDateString,
  MaxLength,
  IsBoolean,
} from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authors: string[];

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsOptional()
  isbn10?: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsDateString()
  @IsOptional()
  publication_date?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  library_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  page_count?: number;

  @IsString()
  @MaxLength(12)
  @IsOptional()
  price?: string;

  @IsUrl()
  @IsOptional()
  cover_image_url?: string;

  @IsString()
  @IsOptional()
  call_number?: string;

  @IsString()
  @IsOptional()
  ddc?: string;

  @IsString()
  @IsOptional()
  lcc?: string;

  @IsString()
  @IsOptional()
  primary_collection_id?: string;

  @IsBoolean()
  create_item: boolean;

  @IsString()
  barcode: string;

}
