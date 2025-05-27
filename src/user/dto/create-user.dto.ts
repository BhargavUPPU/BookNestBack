import { IsString, IsEmail, IsNotEmpty, IsEnum, MinLength, IsBoolean, IsOptional } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  college_id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
} 