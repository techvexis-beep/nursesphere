import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
            },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });
    return participants.map(p => ({
      ...p.conversation,
      otherUser: p.conversation.participants.find(pp => pp.userId !== userId)?.user,
      lastMessage: p.conversation.messages[0],
      unreadCount: 0,
    }));
  }

  async getOrCreateConversation(userId: string, otherUserId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: { some: { userId } },
      },
      include: {
        participants: { where: { userId: otherUserId } },
      },
    });
    if (existing && existing.participants.length > 0) {
      return existing;
    }
    const conversation = await this.prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [{ userId }, { userId: otherUserId }],
        },
      },
      include: {
        participants: { include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      },
    });
    return conversation;
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) throw new BadRequestException('Not a participant');
    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });
    return this.prisma.directMessage.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });
    if (!participant) throw new BadRequestException('Not a participant');
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    const receiverId = conversation.participants.find(p => p.userId !== senderId)?.userId;
    if (!receiverId) throw new BadRequestException('No receiver found');
    const message = await this.prisma.directMessage.create({
      data: { conversationId, senderId, receiverId, content },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    return message;
  }

  async startConversation(senderId: string, receiverId: string, content: string) {
    const conversation = await this.getOrCreateConversation(senderId, receiverId);
    return this.sendMessage(conversation.id, senderId, content);
  }

  async markAsRead(conversationId: string, userId: string) {
    return this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: { messages: { where: { receiverId: userId, isRead: false } } },
        },
      },
    });
    return participants.reduce((acc, p) => acc + p.conversation.messages.length, 0);
  }
}
