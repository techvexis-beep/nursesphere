import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AMAService {
  constructor(private prisma: PrismaService) {}

  async getUpcomingSessions(limit = 20) {
    return this.prisma.aMASession.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { gte: new Date() } },
      include: {
        recruiter: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });
  }

  async getSessionById(id: string) {
    const session = await this.prisma.aMASession.findUnique({
      where: { id },
      include: {
        recruiter: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { questions: true } },
      },
    });
    if (!session) throw new NotFoundException('AMA session not found');
    return session;
  }

  async createSession(data: { recruiterId: string; title: string; description: string; hospitalName?: string; scheduledAt: Date; duration?: number }) {
    return this.prisma.aMASession.create({
      data: {
        recruiterId: data.recruiterId,
        title: data.title,
        description: data.description,
        hospitalName: data.hospitalName,
        scheduledAt: data.scheduledAt,
        duration: data.duration || 60,
      },
    });
  }

  async updateSessionStatus(id: string, status: string) {
    return this.prisma.aMASession.update({
      where: { id },
      data: { status },
    });
  }

  async getSessionQuestions(sessionId: string) {
    return this.prisma.aMAQuestion.findMany({
      where: { sessionId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: [{ upvotesCount: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async submitQuestion(sessionId: string, userId: string, question: string) {
    const session = await this.prisma.aMASession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== 'SCHEDULED' && session.status !== 'LIVE') {
      throw new BadRequestException('Session is not accepting questions');
    }
    const amaQuestion = await this.prisma.aMAQuestion.create({
      data: { sessionId, userId, question },
    });
    await this.prisma.aMASession.update({
      where: { id: sessionId },
      data: { questionsCount: { increment: 1 } },
    });
    return amaQuestion;
  }

  async answerQuestion(questionId: string, recruiterId: string, answer: string) {
    const question = await this.prisma.aMAQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');
    const session = await this.prisma.aMASession.findUnique({ where: { id: question.sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.recruiterId !== recruiterId) throw new BadRequestException('Only the recruiter can answer');
    return this.prisma.aMAQuestion.update({
      where: { id: questionId },
      data: { answer, isAnswered: true },
    });
  }

  async upvoteQuestion(questionId: string, userId: string) {
    const question = await this.prisma.aMAQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');
    await this.prisma.aMAQuestion.update({
      where: { id: questionId },
      data: { upvotesCount: { increment: 1 } },
    });
    return { success: true };
  }

  async joinSession(sessionId: string, userId: string) {
    await this.prisma.aMASession.update({
      where: { id: sessionId },
      data: { attendeesCount: { increment: 1 } },
    });
    return { success: true };
  }

  async getRecruiterSessions(recruiterId: string) {
    return this.prisma.aMASession.findMany({
      where: { recruiterId },
      orderBy: { scheduledAt: 'desc' },
    });
  }
}
