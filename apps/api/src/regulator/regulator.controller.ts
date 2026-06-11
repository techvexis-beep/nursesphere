import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { CreateRegulatorDto, UpdateRegulatorDto, VerifyRegulatorDto, CreatePathwayDto, UpdatePathwayDto, CreateAnnouncementDto, UpdateAnnouncementDto, CreateFAQDto, UpdateFAQDto, RegulatorQueryDto } from './dto/regulator.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('regulators')
export class RegulatorController {
  constructor(private readonly regulatorService: RegulatorService) {}

  // Public endpoints
  @Get()
  async findAll(@Query() query: RegulatorQueryDto) {
    return this.regulatorService.findAllRegulators(query.country);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.regulatorService.findRegulatorBySlug(slug);
  }

  @Get('pathways')
  async findAllPathways(
    @Query('country') country?: string,
    @Query('examRequired') examRequired?: string,
  ) {
    return this.regulatorService.findAllPathways(
      country,
      examRequired === 'true' ? true : examRequired === 'false' ? false : undefined,
    );
  }

  @Get('pathways/countries')
  async findPathwayCountries() {
    return this.regulatorService.findPathwayCountries();
  }

  // Protected endpoints (would need auth in production)
  @Post()
  async create(@Body() dto: CreateRegulatorDto) {
    return this.regulatorService.createRegulator(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.regulatorService.findRegulatorById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRegulatorDto) {
    return this.regulatorService.updateRegulator(id, dto);
  }

  @Put(':id/verify')
  async verify(@Param('id') id: string, @Body() dto: VerifyRegulatorDto) {
    return this.regulatorService.verifyRegulator(id, dto);
  }

  // Pathways
  @Get(':id/pathways')
  async findPathways(
    @Param('id') id: string,
    @Query('country') country?: string,
  ) {
    return this.regulatorService.findPathways(id, country);
  }

  @Post(':id/pathways')
  async createPathway(
    @Param('id') id: string,
    @Body() dto: CreatePathwayDto,
  ) {
    return this.regulatorService.createPathway(id, dto);
  }

  @Put(':id/pathways/:pathwayId')
  async updatePathway(
    @Param('id') id: string,
    @Param('pathwayId') pathwayId: string,
    @Body() dto: UpdatePathwayDto,
  ) {
    return this.regulatorService.updatePathway(id, pathwayId, dto);
  }

  @Delete(':id/pathways/:pathwayId')
  async deletePathway(
    @Param('id') id: string,
    @Param('pathwayId') pathwayId: string,
  ) {
    return this.regulatorService.deletePathway(id, pathwayId);
  }

  // Announcements
  @Get(':id/announcements')
  async findAnnouncements(@Param('id') id: string) {
    return this.regulatorService.findAnnouncements(id);
  }

  @Post(':id/announcements')
  async createAnnouncement(
    @Param('id') id: string,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.regulatorService.createAnnouncement(id, dto);
  }

  @Put(':id/announcements/:announcementId')
  async updateAnnouncement(
    @Param('id') id: string,
    @Param('announcementId') announcementId: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.regulatorService.updateAnnouncement(id, announcementId, dto);
  }

  @Delete(':id/announcements/:announcementId')
  async deleteAnnouncement(
    @Param('id') id: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.regulatorService.deleteAnnouncement(id, announcementId);
  }

  // FAQs
  @Get(':id/faqs')
  async findFAQs(@Param('id') id: string) {
    return this.regulatorService.findFAQs(id);
  }

  @Post(':id/faqs')
  async createFAQ(
    @Param('id') id: string,
    @Body() dto: CreateFAQDto,
  ) {
    return this.regulatorService.createFAQ(id, dto);
  }

  @Put(':id/faqs/:faqId')
  async updateFAQ(
    @Param('id') id: string,
    @Param('faqId') faqId: string,
    @Body() dto: UpdateFAQDto,
  ) {
    return this.regulatorService.updateFAQ(id, faqId, dto);
  }

  @Post(':id/faqs/:faqId/upvote')
  async upvoteFAQ(@Param('faqId') faqId: string) {
    return this.regulatorService.upvoteFAQ(faqId);
  }

  @Delete(':id/faqs/:faqId')
  async deleteFAQ(
    @Param('id') id: string,
    @Param('faqId') faqId: string,
  ) {
    return this.regulatorService.deleteFAQ(id, faqId);
  }

  // Analytics
  @Get(':id/analytics')
  async getAnalytics(@Param('id') id: string) {
    return this.regulatorService.getAnalytics(id);
  }
}
