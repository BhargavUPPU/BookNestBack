import { IsString, IsEnum, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  user_id: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  created_at?: Date;
} 