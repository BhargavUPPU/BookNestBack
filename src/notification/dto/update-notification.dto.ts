import { IsOptional, IsBoolean, IsString, IsObject } from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  type?: NotificationType;
} 