import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegulatorDto, UpdateRegulatorDto, VerifyRegulatorDto, CreatePathwayDto, UpdatePathwayDto, CreateAnnouncementDto, UpdateAnnouncementDto, CreateFAQDto, UpdateFAQDto } from './dto/regulator.dto';

@Injectable()
export class RegulatorService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async findAllRegulators(country?: string) {
    const where = country ? { country, isVerified: true } : { isVerified: true };
    return this.prisma.regulator.findMany({
      where,
      include: {
        _count: {
          select: {
            announcements: { where: { isPublished: true } },
            pathways: { where: { isActive: true } },
            faqs: { where: { isPublished: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findRegulatorBySlug(slug: string) {
    const regulator = await this.prisma.regulator.findUnique({
      where: { slug },
      include: {
        announcements: {
          where: { isPublished: true },
          orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
          take: 10,
        },
        pathways: { where: { isActive: true } },
        faqs: { where: { isPublished: true } },
        _count: {
          select: {
            liveSessions: { where: { status: 'SCHEDULED' } },
          },
        },
      },
    });
    
    if (!regulator) {
      throw new NotFoundException('Regulator not found');
    }
    
    // Increment profile view
    await this.prisma.regulator.update({
      where: { id: regulator.id },
      data: {},
    });
    
    return regulator;
  }

  async findRegulatorById(id: string) {
    const regulator = await this.prisma.regulator.findUnique({
      where: { id },
      include: {
        users: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        },
        _count: {
          select: {
            announcements: true,
            pathways: true,
            faqs: true,
          },
        },
      },
    });
    
    if (!regulator) {
      throw new NotFoundException('Regulator not found');
    }
    
    return regulator;
  }

  async createRegulator(dto: CreateRegulatorDto) {
    const slug = this.slugify(dto.name);
    
    // Check if slug exists
    const existing = await this.prisma.regulator.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('A regulator with this name already exists');
    }
    
    return this.prisma.regulator.create({
      data: {
        name: dto.name,
        slug,
        country: dto.country,
        region: dto.region,
        logo: dto.logo,
        website: dto.website,
        description: dto.description,
        contactEmail: dto.contactEmail,
        phone: dto.phone,
        address: dto.address,
        isVerified: false,
      },
    });
  }

  async updateRegulator(id: string, dto: UpdateRegulatorDto) {
    const regulator = await this.findRegulatorById(id);
    
    return this.prisma.regulator.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.name && { slug: this.slugify(dto.name) }),
      },
    });
  }

  async verifyRegulator(id: string, dto: VerifyRegulatorDto) {
    const regulator = await this.findRegulatorById(id);
    
    return this.prisma.regulator.update({
      where: { id },
      data: {
        isVerified: dto.verified,
        verifiedAt: dto.verified ? new Date() : null,
      },
    });
  }

  // Licensing Pathways
  async findPathways(regulatorId: string, country?: string) {
    const where: any = { regulatorId, isActive: true };
    if (country) where.country = country;
    
    return this.prisma.licensingPathway.findMany({
      where,
      orderBy: { title: 'asc' },
    });
  }

  async findPathwayById(id: string) {
    const pathway = await this.prisma.licensingPathway.findUnique({
      where: { id },
      include: { regulator: true },
    });
    
    if (!pathway) {
      throw new NotFoundException('Pathway not found');
    }
    
    return pathway;
  }

  async createPathway(regulatorId: string, dto: CreatePathwayDto) {
    return this.prisma.licensingPathway.create({
      data: {
        regulatorId,
        country: dto.country,
        pathwayType: dto.pathwayType,
        title: dto.title,
        description: dto.description,
        eligibility: JSON.stringify(dto.eligibility),
        steps: JSON.stringify(dto.steps),
        documents: JSON.stringify(dto.documents),
        fees: JSON.stringify(dto.fees),
        timeline: dto.timeline,
        examRequired: dto.examRequired,
        examName: dto.examName,
        englishRequired: dto.englishRequired,
        englishTests: dto.englishTests ? JSON.stringify(dto.englishTests) : null,
      },
    });
  }

  async updatePathway(regulatorId: string, pathwayId: string, dto: UpdatePathwayDto) {
    const pathway = await this.prisma.licensingPathway.findFirst({
      where: { id: pathwayId, regulatorId },
    });
    
    if (!pathway) {
      throw new NotFoundException('Pathway not found');
    }
    
    const updateData: any = { ...dto };
    if (dto.eligibility) updateData.eligibility = JSON.stringify(dto.eligibility);
    if (dto.steps) updateData.steps = JSON.stringify(dto.steps);
    if (dto.documents) updateData.documents = JSON.stringify(dto.documents);
    if (dto.fees) updateData.fees = JSON.stringify(dto.fees);
    if (dto.englishTests) updateData.englishTests = JSON.stringify(dto.englishTests);
    
    return this.prisma.licensingPathway.update({
      where: { id: pathwayId },
      data: updateData,
    });
  }

  async deletePathway(regulatorId: string, pathwayId: string) {
    const pathway = await this.prisma.licensingPathway.findFirst({
      where: { id: pathwayId, regulatorId },
    });
    
    if (!pathway) {
      throw new NotFoundException('Pathway not found');
    }
    
    return this.prisma.licensingPathway.update({
      where: { id: pathwayId },
      data: { isActive: false },
    });
  }

  // Announcements
  async findAnnouncements(regulatorId: string) {
    return this.prisma.regulatorAnnouncement.findMany({
      where: { regulatorId, isPublished: true },
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
    });
  }

  async createAnnouncement(regulatorId: string, dto: CreateAnnouncementDto) {
    return this.prisma.regulatorAnnouncement.create({
      data: {
        regulatorId,
        title: dto.title,
        content: dto.content,
        category: dto.category || 'LICENSING',
        priority: dto.priority || 'NORMAL',
        isPinned: dto.isPinned || false,
        isPublished: dto.isPublished || false,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });
  }

  async updateAnnouncement(regulatorId: string, announcementId: string, dto: UpdateAnnouncementDto) {
    const announcement = await this.prisma.regulatorAnnouncement.findFirst({
      where: { id: announcementId, regulatorId },
    });
    
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    
    const updateData: any = { ...dto };
    if (dto.isPublished && !announcement.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    return this.prisma.regulatorAnnouncement.update({
      where: { id: announcementId },
      data: updateData,
    });
  }

  async deleteAnnouncement(regulatorId: string, announcementId: string) {
    const announcement = await this.prisma.regulatorAnnouncement.findFirst({
      where: { id: announcementId, regulatorId },
    });
    
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }
    
    return this.prisma.regulatorAnnouncement.delete({
      where: { id: announcementId },
    });
  }

  // FAQs
  async findFAQs(regulatorId: string) {
    return this.prisma.regulatorFAQ.findMany({
      where: { regulatorId, isPublished: true },
      orderBy: { upvotes: 'desc' },
    });
  }

  async createFAQ(regulatorId: string, dto: CreateFAQDto) {
    return this.prisma.regulatorFAQ.create({
      data: {
        regulatorId,
        question: dto.question,
        answer: dto.answer,
        category: dto.category,
      },
    });
  }

  async updateFAQ(regulatorId: string, faqId: string, dto: UpdateFAQDto) {
    const faq = await this.prisma.regulatorFAQ.findFirst({
      where: { id: faqId, regulatorId },
    });
    
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    
    return this.prisma.regulatorFAQ.update({
      where: { id: faqId },
      data: dto,
    });
  }

  async upvoteFAQ(faqId: string) {
    return this.prisma.regulatorFAQ.update({
      where: { id: faqId },
      data: { upvotes: { increment: 1 } },
    });
  }

  async deleteFAQ(regulatorId: string, faqId: string) {
    const faq = await this.prisma.regulatorFAQ.findFirst({
      where: { id: faqId, regulatorId },
    });
    
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    
    return this.prisma.regulatorFAQ.delete({
      where: { id: faqId },
    });
  }

  // Get all licensing pathways (public search)
  async findAllPathways(country?: string, examRequired?: boolean) {
    const where: any = { isActive: true };
    if (country) where.country = country;
    if (examRequired !== undefined) where.examRequired = examRequired;
    
    return this.prisma.licensingPathway.findMany({
      where,
      include: { regulator: { select: { id: true, name: true, slug: true, logo: true, country: true } } },
      orderBy: [{ country: 'asc' }, { title: 'asc' }],
    });
  }

  // Get countries with pathways
  async findPathwayCountries() {
    const pathways = await this.prisma.licensingPathway.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ['country'],
    });
    
    return pathways.map(p => p.country);
  }

  // Analytics
  async getAnalytics(regulatorId: string) {
    const regulator = await this.findRegulatorById(regulatorId);
    
    // Get recent analytics
    const analytics = await this.prisma.regulatorAnalytics.findMany({
      where: { regulatorId },
      orderBy: { date: 'desc' },
      take: 30,
    });
    
    // Aggregate stats
    const totals = analytics.reduce((acc, curr) => ({
      totalMigrations: acc.totalMigrations + curr.totalMigrations,
      activeNurses: curr.activeNurses,
      newApplications: acc.newApplications + curr.newApplications,
      jobPlacements: acc.jobPlacements + curr.jobPlacements,
      profileViews: acc.profileViews + curr.profileViews,
      pathwayViews: acc.pathwayViews + curr.pathwayViews,
      faqViews: acc.faqViews + curr.faqViews,
    }), {
      totalMigrations: 0,
      activeNurses: 0,
      newApplications: 0,
      jobPlacements: 0,
      profileViews: 0,
      pathwayViews: 0,
      faqViews: 0,
    });
    
    return {
      regulator,
      totals,
      recent: analytics,
    };
  }

  // Add regulator user (for linking a user to a regulator)
  async addRegulatorUser(regulatorId: string, userId: string, role: string = 'STAFF', name: string, title?: string) {
    return this.prisma.regulatorUser.create({
      data: {
        regulatorId,
        userId,
        role,
        name,
        title,
      },
    });
  }
}
