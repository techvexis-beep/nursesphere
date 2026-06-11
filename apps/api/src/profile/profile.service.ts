import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    let profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.userProfile.create({ data: { userId } });
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true, createdAt: true },
    });
    return { ...profile, user };
  }

  async updateProfile(userId: string, data: {
    headline?: string;
    bio?: string;
    specialty?: string;
    experienceYears?: number;
    currentRole?: string;
    currentHospital?: string;
    country?: string;
    city?: string;
    isOpenToWork?: boolean;
    isHiring?: boolean;
    linkedIn?: string;
    twitter?: string;
    website?: string;
  }) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, avatar: true, createdAt: true },
    });
    return { ...profile, user };
  }

  async getUserPosts(userId: string, page = 1, limit = 20) {
    return this.prisma.communityPost.findMany({
      where: { authorId: userId },
      include: { community: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUserAnswers(userId: string, page = 1, limit = 20) {
    return this.prisma.threadAnswer.findMany({
      where: { authorId: userId },
      include: { post: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');
    await this.prisma.userFollow.create({
      data: { followerId, followingId },
    });
    await this.prisma.userProfile.update({
      where: { userId: followerId },
      data: { followingCount: { increment: 1 } },
    });
    await this.prisma.userProfile.update({
      where: { userId: followingId },
      data: { followersCount: { increment: 1 } },
    });
    return { success: true };
  }

  async unfollowUser(followerId: string, followingId: string) {
    await this.prisma.userFollow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    await this.prisma.userProfile.update({
      where: { userId: followerId },
      data: { followingCount: { decrement: 1 } },
    });
    await this.prisma.userProfile.update({
      where: { userId: followingId },
      data: { followersCount: { decrement: 1 } },
    });
    return { success: true };
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { following: !!follow };
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    const follows = await this.prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          include: { profile: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return follows.map(f => f.follower);
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const follows = await this.prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: { include: { profile: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return follows.map(f => f.following);
  }

  async searchUsers(query: string, page = 1, limit = 20) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, avatar: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    const profiles = await Promise.all(
      users.map(async (user) => {
        const profile = await this.prisma.userProfile.findUnique({ where: { userId: user.id } });
        return { ...user, headline: profile?.headline, specialty: profile?.specialty };
      })
    );
    return profiles;
  }

  async getRecommendedUsers(userId: string, limit = 10) {
    const following = await this.prisma.userFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);
    const recommended = await this.prisma.userProfile.findMany({
      where: {
        userId: { not: userId, notIn: followingIds.length > 0 ? followingIds : [''] },
        reputationScore: { gte: 100 },
      },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { reputationScore: 'desc' },
      take: limit,
    });
    return recommended;
  }
}
