import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('migration/:country')
  async getMigrationGuidance(@Request() req, @Param('country') country: string) {
    return this.aiService.getMigrationGuidance(req.user?.id || 'demo-user-id', country);
  }

  @Post('chat')
  async chat(@Request() req, @Body() body: { message: string; context?: string }) {
    const { message, context } = body;
    return this.aiService.chatWithAI(req.user?.id || 'demo-user-id', message, context);
  }

  @Post('career/chat')
  async getCareerGuidance(@Request() req, @Body('query') query: string) {
    return this.aiService.getCareerGuidance(req.user?.id || 'demo-user-id', query);
  }

  @Get('churn/predict')
  async getChurnPrediction(@Request() req) {
    return this.aiService.getChurnPrediction(req.user?.id || 'demo-user-id');
  }

  @Post('activity')
  async logStudyActivity(
    @Request() req,
    @Body('activityType') activityType: string,
    @Body('duration') duration: number,
    @Body('metadata') metadata?: any,
  ) {
    return this.aiService.createStudyActivity(req.user?.id || 'demo-user-id', activityType, duration, metadata);
  }
}
