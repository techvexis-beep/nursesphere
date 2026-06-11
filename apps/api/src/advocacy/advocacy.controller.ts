import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdvocacyService } from './advocacy.service';
import { CreateReportDto, CreateSalaryReportDto } from './dto';

@Controller('advocacy')
export class AdvocacyController {
  constructor(private advocacyService: AdvocacyService) {}

  @Post('report')
  createReport(@Request() req: any, @Body() dto: CreateReportDto) {
    const userId = req.user?.id || null;
    return this.advocacyService.createReport(userId, dto);
  }

  @Get('reports')
  getReports(@Request() req: any) {
    return this.advocacyService.getReports(req.user?.id);
  }

  @Post('salary')
  @UseGuards(AuthGuard('jwt'))
  createSalaryReport(@Request() req: any, @Body() dto: CreateSalaryReportDto) {
    return this.advocacyService.createSalaryReport(req.user.id, dto);
  }

  @Get('salary')
  getSalaryReports(@Query('country') country?: string) {
    return this.advocacyService.getSalaryReports(country);
  }

  @Get('salary/stats')
  getSalaryStats() {
    return this.advocacyService.getSalaryStats();
  }

  @Get('stats')
  getDashboardStats() {
    return this.advocacyService.getDashboardStats();
  }
}
