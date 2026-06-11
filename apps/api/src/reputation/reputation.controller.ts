import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReputationService } from './reputation.service';

@Controller('reputation')
export class ReputationController {
  constructor(private reputationService: ReputationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMyReputation(@Request() req: any) {
    return this.reputationService.getReputation(req.user.id);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: number) {
    return this.reputationService.getLeaderboard(limit || 50);
  }

  @Get('badges')
  async getBadges() {
    return this.reputationService.getBadges();
  }

  @Get('top-contributors')
  async getTopContributors(@Query('limit') limit?: number) {
    return this.reputationService.getTopContributors(limit || 10);
  }

  @Post('check-badges')
  @UseGuards(AuthGuard('jwt'))
  async checkBadges(@Request() req: any) {
    return this.reputationService.checkAndAwardBadges(req.user.id);
  }
}
