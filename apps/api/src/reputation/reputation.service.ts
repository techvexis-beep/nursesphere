import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async getReputation(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const badges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });
    return { ...profile, badges };
  }

  async getLeaderboard(limit = 50) {
    return this.prisma.userProfile.findMany({
      where: { reputationScore: { gt: 0 } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { reputationScore: 'desc' },
      take: limit,
    });
  }

  async getBadges() {
    return this.prisma.badge.findMany();
  }

  async awardBadge(userId: string, badgeName: string) {
    const badge = await this.prisma.badge.findUnique({ where: { name: badgeName } });
    if (!badge) return null;
    const existing = await this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (existing) return existing;
    return this.prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });
  }

  async checkAndAwardBadges(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const awarded: any[] = [];
    if (profile && profile.postsCount >= 1) {
      const badge = await this.prisma.badge.findUnique({ where: { name: 'First Post' } });
      if (badge) {
        const existing = await this.prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
        });
        if (!existing) {
          await this.prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
          awarded.push(badge);
        }
      }
    }
    if (profile && profile.helpfulCount >= 10) {
      const badge = await this.prisma.badge.findUnique({ where: { name: 'Helper' } });
      if (badge) {
        const existing = await this.prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
        });
        if (!existing) {
          await this.prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
          awarded.push(badge);
        }
      }
    }
    if (profile && profile.reputationScore >= 1000) {
      const badge = await this.prisma.badge.findUnique({ where: { name: 'Expert' } });
      if (badge) {
        const existing = await this.prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
        });
        if (!existing) {
          await this.prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
          awarded.push(badge);
        }
      }
    }
    return awarded;
  }

  async updateExpertLevel(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) return;
    let level = 'NEWCOMER';
    if (profile.reputationScore >= 1000) level = 'MASTER';
    else if (profile.reputationScore >= 500) level = 'EXPERT';
    else if (profile.reputationScore >= 100) level = 'CONTRIBUTOR';
    await this.prisma.userProfile.update({
      where: { userId },
      data: { expertLevel: level },
    });
    return level;
  }

  async getTopContributors(limit = 10) {
    return this.prisma.userProfile.findMany({
      where: { expertLevel: { in: ['EXPERT', 'MASTER'] } },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { reputationScore: 'desc' },
      take: limit,
    });
  }
}
