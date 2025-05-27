import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  library_name: string;

  @IsString()
  @IsNotEmpty()
  college_id: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsJSON()
  @IsNotEmpty()
  opening_hours: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  contact_phone: string;
} 