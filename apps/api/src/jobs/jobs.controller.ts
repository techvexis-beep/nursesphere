import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Inject, NotFoundException, ForbiddenException, Headers } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto, ApplyJobDto, ExternalJobQueryDto } from './dto/jobs.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getJobs(@Query() query: JobQueryDto) {
    return this.jobsService.getJobs(query);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post()
  async createJob(@Request() req, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(req.user?.id || 'demo-user-id', dto);
  }

  @Put(':id')
  async updateJob(@Request() req, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) throw new ForbiddenException('Only employers can post jobs');
    return this.jobsService.updateJob(id, employer.id, dto);
  }

  @Delete(':id')
  async deleteJob(@Request() req, @Param('id') id: string) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) throw new ForbiddenException('Only employers can delete jobs');
    return this.jobsService.deleteJob(id, employer.id);
  }

  @Post(':id/apply')
  async applyForJob(@Request() req, @Param('id') id: string, @Body() dto: ApplyJobDto) {
    return this.jobsService.applyForJob(id, req.user?.id || 'demo-user-id', dto);
  }

  @Get('employer/my-jobs')
  async getEmployerJobs(@Request() req) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) return [];
    return this.jobsService.getEmployerJobs(employer.id);
  }

  @Get('employer/stats')
  async getEmployerStats(@Request() req) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) return { totalJobs: 0, activeJobs: 0, totalViews: 0, totalApplications: 0, jobs: [] };
    return this.jobsService.getJobStats(employer.id);
  }

  @Get(':id/applications')
  async getJobApplications(@Request() req, @Param('id') id: string) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) throw new ForbiddenException('Only employers can view applications');
    return this.jobsService.getJobApplications(id, employer.id);
  }

  @Put('applications/:applicationId/status')
  async updateApplicationStatus(
    @Request() req,
    @Param('applicationId') applicationId: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    const employer = await this.prisma.employer.findUnique({ where: { userId: req.user?.id || 'demo-user-id' } });
    if (!employer) throw new ForbiddenException('Only employers can update applications');
    return this.jobsService.updateApplicationStatus(applicationId, employer.id, status, notes);
  }

  @Get('candidate/my-applications')
  async getCandidateApplications(@Request() req) {
    return this.jobsService.getCandidateApplications(req.user?.id || 'demo-user-id');
  }

  @Get('external')
  async getExternalJobs(
    @Query() query: ExternalJobQueryDto,
    @Headers('x-user-country') userCountry?: string,
    @Headers('x-user-city') userCity?: string,
  ) {
    const userLocation = userCity || userCountry;
    return this.jobsService.fetchExternalJobs(query, userLocation);
  }

  @Get('external/recommended')
  async getRecommendedJobs(
    @Headers('x-user-country') userCountry?: string,
    @Headers('x-user-city') userCity?: string,
  ) {
    return this.jobsService.fetchJobsByLocation(userCountry, userCity);
  }

  @Get('external/:id')
  async getExternalJobById(@Param('id') id: string) {
    return this.jobsService.fetchExternalJobById(id);
  }
}
