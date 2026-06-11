import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClinicalLogService } from './clinical-log.service';
import { CreateClinicalLogDto, UpdateClinicalLogDto } from './dto';

@Controller('clinical-logs')
@UseGuards(AuthGuard('jwt'))
export class ClinicalLogController {
  constructor(private clinicalLogService: ClinicalLogService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateClinicalLogDto) {
    return this.clinicalLogService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.clinicalLogService.findAll(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.clinicalLogService.getStats(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.clinicalLogService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateClinicalLogDto) {
    return this.clinicalLogService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.clinicalLogService.delete(id, req.user.id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Request() req: any) {
    return this.clinicalLogService.approve(id, req.user.id);
  }
}
