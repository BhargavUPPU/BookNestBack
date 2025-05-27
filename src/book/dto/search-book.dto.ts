import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";

export class SearchBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  library_id?: string;

  @IsString()
  @IsOptional()
  collection_id?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
