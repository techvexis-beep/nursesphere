import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMigrationDto } from './dto';

@Injectable()
export class MigrationService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateProgress(userId: string) {
    let progress = await this.prisma.migrationProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await this.prisma.migrationProgress.create({
        data: { userId },
      });
    }

    return this.updateReadinessScore(progress);
  }

  async updateProgress(userId: string, dto: UpdateMigrationDto) {
    const progress = await this.prisma.migrationProgress.update({
      where: { userId },
      data: {
        targetCountry: dto.targetCountry,
        nclexStatus: dto.nclexStatus,
        nclexDate: dto.nclexDate,
        nclexScore: dto.nclexScore,
        ieltsStatus: dto.ieltsStatus,
        ieltsDate: dto.ieltsDate,
        ieltsScore: dto.ieltsScore,
        oetStatus: dto.oetStatus,
        oetDate: dto.oetDate,
        oetScore: dto.oetScore,
        credentialEvalStatus: dto.credentialEvalStatus,
        credentialEvalDate: dto.credentialEvalDate,
        visaStatus: dto.visaStatus,
        visaDate: dto.visaDate,
        costEstimate: dto.costEstimate,
      },
    });

    return this.updateReadinessScore(progress);
  }

  async getMigrationStats() {
    const countries = ['USA', 'UK', 'Canada'];
    const stats = await Promise.all(
      countries.map(async (country) => {
        const count = await this.prisma.migrationProgress.count({
          where: { targetCountry: country },
        });
        const avgScore = await this.prisma.migrationProgress.aggregate({
          where: { targetCountry: country },
          _avg: { readinessScore: true },
        });
        return { country, count, avgScore: avgScore._avg.readinessScore || 0 };
      })
    );
    return stats;
  }

  private async updateReadinessScore(progress: any) {
    let score = 0;
    const weights = {
      nclex: 25,
      ielts: 20,
      oet: 20,
      credentialEval: 20,
      visa: 15,
    };

    if (progress.nclexStatus === 'COMPLETED') score += weights.nclex;
    else if (progress.nclexStatus === 'IN_PROGRESS') score += weights.nclex * 0.5;

    if (progress.ieltsStatus === 'COMPLETED') score += weights.ielts;
    else if (progress.ieltsStatus === 'IN_PROGRESS') score += weights.ielts * 0.5;

    if (progress.oetStatus === 'COMPLETED') score += weights.oet;
    else if (progress.oetStatus === 'IN_PROGRESS') score += weights.oet * 0.5;

    if (progress.credentialEvalStatus === 'COMPLETED') score += weights.credentialEval;
    else if (progress.credentialEvalStatus === 'IN_PROGRESS') score += weights.credentialEval * 0.5;

    if (progress.visaStatus === 'COMPLETED') score += weights.visa;
    else if (progress.visaStatus === 'IN_PROGRESS') score += weights.visa * 0.5;

    return this.prisma.migrationProgress.update({
      where: { userId: progress.userId },
      data: { readinessScore: score },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  async getCountriesWithPathways() {
    const pathways = await this.prisma.licensingPathway.findMany({
      where: { isActive: true },
      select: { country: true },
      distinct: ['country'],
    });

    const countries = await Promise.all(
      pathways.map(async (p) => {
        const regulators = await this.prisma.regulator.findMany({
          where: {
            country: p.country,
            isVerified: true,
          },
          select: { id: true },
        });
        
        return {
          code: p.country,
          name: this.getCountryName(p.country),
          flag: this.getCountryFlag(p.country),
          regulatorCount: regulators.length,
        };
      })
    );

    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  private getCountryName(code: string): string {
    const names: Record<string, string> = {
      'USA': 'United States',
      'UK': 'United Kingdom',
      'Canada': 'Canada',
      'Australia': 'Australia',
      'UAE': 'United Arab Emirates',
      'Germany': 'Germany',
      'Ireland': 'Ireland',
      'Saudi Arabia': 'Saudi Arabia',
      'New Zealand': 'New Zealand',
      'Singapore': 'Singapore',
    };
    return names[code] || code;
  }

  private getCountryFlag(code: string): string {
    const flags: Record<string, string> = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'UAE': '🇦🇪',
      'Germany': '🇩🇪',
      'Ireland': '🇮🇪',
      'Saudi Arabia': '🇸🇦',
      'New Zealand': '🇳🇿',
      'Singapore': '🇸🇬',
    };
    return flags[code] || '🌍';
  }

  async getRegulatorsByCountry(country: string) {
    return this.prisma.regulator.findMany({
      where: {
        country,
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        website: true,
        description: true,
        region: true,
        _count: {
          select: {
            pathways: { where: { isActive: true } },
            liveSessions: { where: { status: 'SCHEDULED' } },
            tracking: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getPathwaysByRegulator(regulatorId: string) {
    return this.prisma.licensingPathway.findMany({
      where: {
        regulatorId,
        isActive: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async trackRegulator(userId: string, regulatorId: string, country: string) {
    const existing = await this.prisma.userRegulatorTracking.findUnique({
      where: {
        userId_regulatorId: { userId, regulatorId },
      },
    });

    if (existing) {
      await this.prisma.userRegulatorTracking.update({
        where: { id: existing.id },
        data: { isActive: true },
      });
    } else {
      await this.prisma.userRegulatorTracking.create({
        data: { userId, regulatorId, country },
      });
    }

    const count = await this.prisma.userRegulatorTracking.count({
      where: { regulatorId, isActive: true },
    });

    return { success: true, trackerCount: count };
  }

  async untrackRegulator(userId: string, regulatorId: string) {
    await this.prisma.userRegulatorTracking.updateMany({
      where: { userId, regulatorId },
      data: { isActive: false },
    });

    const count = await this.prisma.userRegulatorTracking.count({
      where: { regulatorId, isActive: true },
    });

    return { success: true, trackerCount: count };
  }

  async getUserTrackedRegulators(userId: string) {
    const tracking = await this.prisma.userRegulatorTracking.findMany({
      where: { userId, isActive: true },
      include: {
        regulator: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            country: true,
            _count: {
              select: {
                pathways: { where: { isActive: true } },
                liveSessions: { where: { status: 'SCHEDULED' } },
              },
            },
          },
        },
      },
    });

    return tracking.map(t => t.regulator);
  }

  async submitQuestion(userId: string, regulatorId: string, question: string) {
    return this.prisma.regulatorQuestion.create({
      data: {
        userId,
        regulatorId,
        question,
        status: 'PENDING',
      },
    });
  }

  async getRegulatorQuestions(regulatorId: string) {
    return this.prisma.regulatorQuestion.findMany({
      where: { regulatorId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getRegulatorTrackingStats(regulatorId: string) {
    const totalTrackers = await this.prisma.userRegulatorTracking.count({
      where: { regulatorId, isActive: true },
    });

    const recentTrackers = await this.prisma.userRegulatorTracking.count({
      where: {
        regulatorId,
        isActive: true,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    const pendingQuestions = await this.prisma.regulatorQuestion.count({
      where: { regulatorId, status: 'PENDING' },
    });

    return { totalTrackers, recentTrackers, pendingQuestions };
  }

  async getRegulatorTrackersList(regulatorId: string) {
    const tracking = await this.prisma.userRegulatorTracking.findMany({
      where: { regulatorId, isActive: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const progress = await Promise.all(
      tracking.map(async (t) => {
        const migration = await this.prisma.migrationProgress.findUnique({
          where: { userId: t.userId },
        });
        return {
          user: t.user,
          targetCountry: migration?.targetCountry,
          readinessScore: migration?.readinessScore || 0,
          trackedAt: t.createdAt,
        };
      })
    );

    return progress;
  }
}
