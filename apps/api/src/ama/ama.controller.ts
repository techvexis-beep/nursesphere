import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AMAService } from './ama.service';

@Controller('ama')
export class AMAController {
  constructor(private amaService: AMAService) {}

  @Get('sessions')
  async getUpcomingSessions(@Query('limit') limit?: number) {
    return this.amaService.getUpcomingSessions(limit || 20);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    return this.amaService.getSessionById(id);
  }

  @Post('sessions')
  @UseGuards(AuthGuard('jwt'))
  async createSession(@Request() req: any, @Body() body: { title: string; description: string; hospitalName?: string; scheduledAt: string; duration?: number }) {
    return this.amaService.createSession({
      recruiterId: req.user.id,
      title: body.title,
      description: body.description,
      hospitalName: body.hospitalName,
      scheduledAt: new Date(body.scheduledAt),
      duration: body.duration,
    });
  }

  @Put('sessions/:id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.amaService.updateSessionStatus(id, body.status);
  }

  @Get('sessions/:id/questions')
  async getQuestions(@Param('id') id: string) {
    return this.amaService.getSessionQuestions(id);
  }

  @Post('sessions/:id/questions')
  @UseGuards(AuthGuard('jwt'))
  async submitQuestion(@Param('id') id: string, @Request() req: any, @Body() body: { question: string }) {
    return this.amaService.submitQuestion(id, req.user.id, body.question);
  }

  @Post('questions/:id/answer')
  @UseGuards(AuthGuard('jwt'))
  async answerQuestion(@Param('id') id: string, @Request() req: any, @Body() body: { answer: string }) {
    return this.amaService.answerQuestion(id, req.user.id, body.answer);
  }

  @Post('questions/:id/upvote')
  @UseGuards(AuthGuard('jwt'))
  async upvoteQuestion(@Param('id') id: string) {
    return this.amaService.upvoteQuestion(id, '');
  }

  @Post('sessions/:id/join')
  @UseGuards(AuthGuard('jwt'))
  async joinSession(@Param('id') id: string, @Request() req: any) {
    return this.amaService.joinSession(id, req.user.id);
  }

  @Get('my-sessions')
  @UseGuards(AuthGuard('jwt'))
  async getMySessions(@Request() req: any) {
    return this.amaService.getRecruiterSessions(req.user.id);
  }
}
