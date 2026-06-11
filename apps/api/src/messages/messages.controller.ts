import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations')
  async getConversations(@Request() req: any) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversations/:id')
  async getMessages(@Param('id') id: string, @Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.messagesService.getMessages(id, req.user.id, page || 1, limit || 50);
  }

  @Post('conversations')
  async startConversation(@Request() req: any, @Body() body: { receiverId: string; content: string }) {
    return this.messagesService.startConversation(req.user.id, body.receiverId, body.content);
  }

  @Post('conversations/:id')
  async sendMessage(@Param('id') id: string, @Request() req: any, @Body() body: { content: string }) {
    return this.messagesService.sendMessage(id, req.user.id, body.content);
  }

  @Post('conversations/:id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.messagesService.markAsRead(id, req.user.id);
  }

  @Get('unread')
  async getUnreadCount(@Request() req: any) {
    return this.messagesService.getUnreadCount(req.user.id);
  }
}
