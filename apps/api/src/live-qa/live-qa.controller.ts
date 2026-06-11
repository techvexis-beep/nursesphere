import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { LiveQAService } from './live-qa.service';
import { CreateSessionDto, UpdateSessionDto, AnswerQuestionDto } from './dto/live-qa.dto';

@Controller('live-qa')
export class LiveQAController {
  constructor(private readonly liveQAService: LiveQAService) {}

  @Get('sessions')
  async findAllSessions(@Query('regulatorId') regulatorId?: string) {
    return this.liveQAService.findAllSessions(regulatorId);
  }

  @Get('sessions/upcoming')
  async findUpcomingSessions(@Query('limit') limit?: number) {
    return this.liveQAService.findUpcomingSessions(limit || 10);
  }

  @Get('sessions/:id')
  async findSessionById(@Param('id') id: string) {
    return this.liveQAService.findSessionById(id);
  }

  @Get('sessions/:id/questions')
  async getSessionQuestions(
    @Param('id') id: string,
    @Query('includeUnanswered') includeUnanswered?: string,
  ) {
    return this.liveQAService.getSessionQuestions(
      id,
      includeUnanswered !== 'false',
    );
  }

  @Post('sessions')
  async createSession(
    @Body() dto: CreateSessionDto,
  ) {
    return this.liveQAService.createSession(dto.regulatorId, {
      title: dto.title,
      description: dto.description,
      scheduledAt: new Date(dto.scheduledAt),
      duration: dto.duration,
      isRecorded: dto.isRecorded,
    });
  }

  @Put('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ) {
    if (!dto.regulatorId) {
      throw new BadRequestException('regulatorId is required');
    }
    return this.liveQAService.updateSession(dto.regulatorId, id, {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
      ...(dto.duration && { duration: dto.duration }),
      ...(dto.status && { status: dto.status }),
      ...(dto.streamUrl && { streamUrl: dto.streamUrl }),
    });
  }

  @Put('sessions/:id/start')
  async startSession(
    @Param('id') id: string,
    @Body() body: { regulatorId: string; streamUrl: string },
  ) {
    return this.liveQAService.startSession(body.regulatorId, id, body.streamUrl);
  }

  @Put('sessions/:id/end')
  async endSession(
    @Param('id') id: string,
    @Body() body: { regulatorId: string },
  ) {
    return this.liveQAService.endSession(body.regulatorId, id);
  }

  @Delete('sessions/:id')
  async deleteSession(
    @Param('id') id: string,
    @Body() body: { regulatorId: string },
  ) {
    return this.liveQAService.deleteSession(body.regulatorId, id);
  }

  @Post('sessions/:id/questions')
  async addQuestion(
    @Param('id') sessionId: string,
    @Body() body: { userId?: string; question: string },
  ) {
    return this.liveQAService.addQuestion(sessionId, body.userId || null, body.question);
  }

  @Put('questions/:id/answer')
  async answerQuestion(
    @Param('id') questionId: string,
    @Body() body: AnswerQuestionDto,
  ) {
    return this.liveQAService.answerQuestion(body.regulatorId, questionId, body.answer);
  }

  @Post('questions/:id/upvote')
  async upvoteQuestion(@Param('id') questionId: string) {
    return this.liveQAService.upvoteQuestion(questionId);
  }
}
