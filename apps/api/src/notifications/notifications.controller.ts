import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req, @Query('unread') unreadOnly?: string) {
    return this.notificationsService.getUserNotifications(req.user?.id || 'demo-user-id', unreadOnly === 'true');
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user?.id || 'demo-user-id');
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.notificationsService.getNotificationPreferences(req.user?.id || 'demo-user-id');
  }

  @Put('preferences')
  async updatePreferences(@Request() req, @Body() preferences: any) {
    return this.notificationsService.updateNotificationPreferences(req.user?.id || 'demo-user-id', preferences);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user?.id || 'demo-user-id');
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user?.id || 'demo-user-id');
  }

  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(id, req.user?.id || 'demo-user-id');
  }

  @Get('trigger-retention')
  async triggerRetentionCampaigns() {
    return this.notificationsService.triggerRetentionCampaigns();
  }
}
