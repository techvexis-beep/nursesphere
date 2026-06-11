import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LiveQAService {
  constructor(private prisma: PrismaService) {}

  async findAllSessions(regulatorId?: string) {
    const where = regulatorId ? { regulatorId } : {};
    return this.prisma.liveQASession.findMany({
      where,
      include: {
        regulator: { select: { id: true, name: true, slug: true, logo: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findUpcomingSessions(limit: number = 10) {
    const now = new Date();
    return this.prisma.liveQASession.findMany({
      where: {
        scheduledAt: { gte: now },
        status: { in: ['SCHEDULED', 'LIVE'] },
      },
      include: {
        regulator: { select: { id: true, name: true, slug: true, logo: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });
  }

  async findSessionById(id: string) {
    const session = await this.prisma.liveQASession.findUnique({
      where: { id },
      include: {
        regulator: { select: { id: true, name: true, slug: true, logo: true, website: true } },
        questions: {
          where: { isAnswered: true },
          orderBy: { upvotes: 'desc' },
          take: 20,
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async createSession(regulatorId: string, data: {
    title: string;
    description?: string;
    scheduledAt: Date;
    duration?: number;
    isRecorded?: boolean;
  }) {
    return this.prisma.liveQASession.create({
      data: {
        regulatorId,
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt,
        duration: data.duration || 60,
        isRecorded: data.isRecorded !== false,
        status: 'SCHEDULED',
      },
    });
  }

  async updateSession(regulatorId: string, sessionId: string, data: {
    title?: string;
    description?: string;
    scheduledAt?: Date;
    duration?: number;
    status?: string;
    streamUrl?: string;
  }) {
    const session = await this.prisma.liveQASession.findFirst({
      where: { id: sessionId, regulatorId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.liveQASession.update({
      where: { id: sessionId },
      data,
    });
  }

  async deleteSession(regulatorId: string, sessionId: string) {
    const session = await this.prisma.liveQASession.findFirst({
      where: { id: sessionId, regulatorId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Delete all questions first
    await this.prisma.liveQAQuestion.deleteMany({
      where: { sessionId },
    });

    return this.prisma.liveQASession.delete({
      where: { id: sessionId },
    });
  }

  async startSession(regulatorId: string, sessionId: string, streamUrl: string) {
    const session = await this.prisma.liveQASession.findFirst({
      where: { id: sessionId, regulatorId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.liveQASession.update({
      where: { id: sessionId },
      data: { status: 'LIVE', streamUrl },
    });
  }

  async endSession(regulatorId: string, sessionId: string) {
    const session = await this.prisma.liveQASession.findFirst({
      where: { id: sessionId, regulatorId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.liveQASession.update({
      where: { id: sessionId },
      data: { status: 'ENDED', endedAt: new Date() },
    });
  }

  async addQuestion(sessionId: string, userId: string | null, question: string) {
    return this.prisma.liveQAQuestion.create({
      data: {
        sessionId,
        userId,
        question,
      },
    });
  }

  async answerQuestion(regulatorId: string, questionId: string, answer: string) {
    const question = await this.prisma.liveQAQuestion.findFirst({
      where: {
        id: questionId,
        session: { regulatorId },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.liveQAQuestion.update({
      where: { id: questionId },
      data: { answer, isAnswered: true },
    });
  }

  async upvoteQuestion(questionId: string) {
    return this.prisma.liveQAQuestion.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    });
  }

  async getSessionQuestions(sessionId: string, includeUnanswered: boolean = true) {
    const where: any = { sessionId };
    if (!includeUnanswered) {
      where.isAnswered = true;
    }

    return this.prisma.liveQAQuestion.findMany({
      where,
      orderBy: [
        { isAnswered: 'desc' },
        { upvotes: 'desc' },
      ],
    });
  }

  async incrementAttendeeCount(sessionId: string) {
    return this.prisma.liveQASession.update({
      where: { id: sessionId },
      data: { attendeeCount: { increment: 1 } },
    });
  }
}
