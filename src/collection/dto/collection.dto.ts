import { IsString, IsOptional } from "class-validator";

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsString()
  library_id: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCollectionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  library_id?: string;
}
