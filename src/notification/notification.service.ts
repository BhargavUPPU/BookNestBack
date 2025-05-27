import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';


@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        notification_id: createNotificationDto.user_id + Date.now().toString(),
        user_id: createNotificationDto.user_id,
        type: createNotificationDto.type,
        message: createNotificationDto.message,
        is_read: createNotificationDto.is_read || false,
        metadata: createNotificationDto.metadata || {},
        created_at: createNotificationDto.created_at || new Date()
      }
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { 
        user_id: userId,
        is_read: false
      }
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { notification_id: id },
      include: {
        user: true,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { notification_id: id },
      data: { is_read: true }
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: { notification_id: id }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true }
    });
  }
  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { notification_id: id },
      data: updateNotificationDto
    });
  }
  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { notification_id: id }
    });
  }
} 