import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamService } from './exam.service';

@Controller('exams')
@UseGuards(AuthGuard('jwt'))
export class ExamController {
  constructor(private examService: ExamService) {}

  @Get('questions')
  getQuestions(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('limit') limit?: string,
  ) {
    return this.examService.getQuestions(category, difficulty, limit ? parseInt(limit) : 10);
  }

  @Post('submit')
  async submit(
    @Request() req: any,
    @Body() body: { answers: { questionId: string; answer: number }[]; timeSpent: number },
  ) {
    return this.examService.submitExam(req.user.id, body.answers, body.timeSpent);
  }

  @Get('history')
  async getHistory(@Request() req: any) {
    return this.examService.getHistory(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.examService.getStats(req.user.id);
  }
}
