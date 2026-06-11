import { Controller, Get, Put, Post, Delete, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MigrationService } from './migration.service';
import { UpdateMigrationDto } from './dto';

@Controller('migration')
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @Get('progress')
  @UseGuards(AuthGuard('jwt'))
  async getProgress(@Request() req: any) {
    return this.migrationService.getOrCreateProgress(req.user.id);
  }

  @Put('progress')
  @UseGuards(AuthGuard('jwt'))
  async updateProgress(@Request() req: any, @Body() dto: UpdateMigrationDto) {
    return this.migrationService.updateProgress(req.user.id, dto);
  }

  @Get('stats')
  async getStats() {
    return this.migrationService.getMigrationStats();
  }

  @Get('countries')
  async getCountries() {
    return this.migrationService.getCountriesWithPathways();
  }

  @Get('regulators')
  async getRegulators(@Query('country') country: string) {
    return this.migrationService.getRegulatorsByCountry(country);
  }

  @Get('pathways')
  async getPathways(@Query('regulatorId') regulatorId: string) {
    return this.migrationService.getPathwaysByRegulator(regulatorId);
  }

  @Post('track')
  @UseGuards(AuthGuard('jwt'))
  async trackRegulator(
    @Request() req: any,
    @Body() body: { regulatorId: string; country: string }
  ) {
    return this.migrationService.trackRegulator(req.user.id, body.regulatorId, body.country);
  }

  @Delete('track')
  @UseGuards(AuthGuard('jwt'))
  async untrackRegulator(
    @Request() req: any,
    @Body() body: { regulatorId: string }
  ) {
    return this.migrationService.untrackRegulator(req.user.id, body.regulatorId);
  }

  @Get('tracking')
  @UseGuards(AuthGuard('jwt'))
  async getUserTracking(@Request() req: any) {
    return this.migrationService.getUserTrackedRegulators(req.user.id);
  }

  @Post('question')
  @UseGuards(AuthGuard('jwt'))
  async submitQuestion(
    @Request() req: any,
    @Body() body: { regulatorId: string; question: string }
  ) {
    return this.migrationService.submitQuestion(req.user.id, body.regulatorId, body.question);
  }
}
