import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: any, @Query('unread') unreadOnly?: string) {
    return this.notificationsService.getUserNotifications(req.user?.id || 'demo-user-id', unreadOnly === 'true');
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user?.id || 'demo-user-id');
  }

  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.notificationsService.getNotificationPreferences(req.user?.id || 'demo-user-id');
  }

  @Put('preferences')
  async updatePreferences(@Request() req: any, @Body() preferences: any) {
    return this.notificationsService.updateNotificationPreferences(req.user?.id || 'demo-user-id', preferences);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user?.id || 'demo-user-id');
  }

  @Put(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user?.id || 'demo-user-id');
  }

  @Delete(':id')
  async deleteNotification(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(id, req.user?.id || 'demo-user-id');
  }

  @Get('trigger-retention')
  async triggerRetentionCampaigns() {
    return this.notificationsService.triggerRetentionCampaigns();
  }
}
