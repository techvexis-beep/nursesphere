import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string, unreadOnly?: boolean) {
    const where: any = { userId };
    if (unreadOnly) where.isRead = false;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getNotificationById(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    return this.prisma.notification.create({
      data: {
        ...data,
        data: data.data ? JSON.stringify(data.data) : null,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async getNotificationPreferences(userId: string) {
    return {
      email: true,
      push: true,
      types: {
        examReminders: true,
        migrationUpdates: true,
        jobAlerts: true,
        systemAnnouncements: true,
      },
    };
  }

  async updateNotificationPreferences(userId: string, preferences: any) {
    return { success: true, preferences };
  }

  async triggerRetentionCampaigns() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveUsers = await this.prisma.user.findMany({
      where: {
        isActive: true,
        createdAt: { lt: thirtyDaysAgo },
      },
      include: {
        studyActivities: {
          where: { createdAt: { gte: thirtyDaysAgo } },
        },
      },
    });

    for (const user of inactiveUsers) {
      if (user.studyActivities.length === 0) {
        await this.createNotification({
          userId: user.id,
          type: 'RE_ENGAGEMENT',
          title: 'We miss you!',
          message: 'Your nursing journey awaits. Resume your studies today.',
          data: { campaign: 'inactive_30_days' },
        });
      }
    }

    return { notified: inactiveUsers.length };
  }
}
