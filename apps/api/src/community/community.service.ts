import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async findAllCommunities(type?: string) {
    const where = type ? { type, isPrivate: false } : { isPrivate: false };
    return this.prisma.community.findMany({
      where,
      orderBy: { membersCount: 'desc' },
    });
  }

  async findCommunityBySlug(slug: string) {
    const community = await this.prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true, members: true },
        },
      },
    });
    if (!community) throw new NotFoundException('Community not found');
    return community;
  }

  async createCommunity(data: { name: string; description: string; type: string; icon?: string; color?: string }) {
    const slug = this.slugify(data.name);
    const existing = await this.prisma.community.findUnique({ where: { slug } });
    if (existing) throw new BadRequestException('Community already exists');
    return this.prisma.community.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        type: data.type,
        icon: data.icon,
        color: data.color || '#6366F1',
      },
    });
  }

  async joinCommunity(communityId: string, userId: string) {
    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (existing) throw new BadRequestException('Already a member');
    await this.prisma.communityMember.create({
      data: { communityId, userId },
    });
    await this.prisma.community.update({
      where: { id: communityId },
      data: { membersCount: { increment: 1 } },
    });
    return { success: true };
  }

  async leaveCommunity(communityId: string, userId: string) {
    await this.prisma.communityMember.delete({
      where: { communityId_userId: { communityId, userId } },
    });
    await this.prisma.community.update({
      where: { id: communityId },
      data: { membersCount: { decrement: 1 } },
    });
    return { success: true };
  }

  async getCommunityPosts(communityId: string, page = 1, limit = 20) {
    return this.prisma.communityPost.findMany({
      where: { communityId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { comments: true, answers: true } },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async createPost(data: { communityId: string; authorId: string; title: string; content: string; type: string; tags?: string[] }) {
    const post = await this.prisma.communityPost.create({
      data: {
        communityId: data.communityId,
        authorId: data.authorId,
        title: data.title,
        content: data.content,
        type: data.type,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      },
    });
    await this.prisma.community.update({
      where: { id: data.communityId },
      data: { postsCount: { increment: 1 } },
    });
    await this.prisma.userProfile.upsert({
      where: { userId: data.authorId },
      update: { postsCount: { increment: 1 } },
      create: { userId: data.authorId },
    });
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true, answers: true, upvotes: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    await this.prisma.communityPost.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    });
    return post;
  }

  async upvotePost(postId: string, userId: string) {
    const existing = await this.prisma.postUpvote.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.postUpvote.delete({ where: { id: existing.id } });
      await this.prisma.communityPost.update({
        where: { id: postId },
        data: { upvotesCount: { decrement: 1 } },
      });
      return { upvoted: false };
    }
    await this.prisma.postUpvote.create({ data: { postId, userId } });
    await this.prisma.communityPost.update({
      where: { id: postId },
      data: { upvotesCount: { increment: 1 } },
    });
    return { upvoted: true };
  }

  async createAnswer(postId: string, authorId: string, content: string) {
    const answer = await this.prisma.threadAnswer.create({
      data: { postId, authorId, content },
    });
    await this.prisma.communityPost.update({
      where: { id: postId },
      data: { answersCount: { increment: 1 } },
    });
    await this.prisma.userProfile.upsert({
      where: { userId: authorId },
      update: { answersCount: { increment: 1 } },
      create: { userId: authorId },
    });
    return answer;
  }

  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.threadAnswer.findUnique({ where: { id: answerId } });
    if (!answer) throw new NotFoundException('Answer not found');
    const post = await this.prisma.communityPost.findUnique({ where: { id: answer.postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new BadRequestException('Only author can accept');
    await this.prisma.threadAnswer.update({ where: { id: answerId }, data: { isAccepted: true } });
    await this.prisma.communityPost.update({ where: { id: post.id }, data: { isAnswered: true } });
    await this.prisma.userProfile.upsert({
      where: { userId: answer.authorId },
      update: { helpfulCount: { increment: 1 }, reputationScore: { increment: 25 } },
      create: { userId: answer.authorId, helpfulCount: 1, reputationScore: 25 },
    });
    return { success: true };
  }

  async getPostAnswers(postId: string) {
    return this.prisma.threadAnswer.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: [{ isAccepted: 'desc' }, { upvotesCount: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async createComment(postId: string, authorId: string, content: string, parentId?: string) {
    const comment = await this.prisma.communityComment.create({
      data: { postId, authorId, content, parentId },
    });
    await this.prisma.communityPost.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });
    return comment;
  }

  async getPostComments(postId: string) {
    return this.prisma.communityComment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        replies: {
          include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserFeed(userId: string, page = 1, limit = 20) {
    const following = await this.prisma.userFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);
    return this.prisma.communityPost.findMany({
      where: { authorId: { in: followingIds } },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getTrendingPosts(limit = 10) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.prisma.communityPost.findMany({
      where: { createdAt: { gte: weekAgo } },
      orderBy: [{ upvotesCount: 'desc' }, { viewsCount: 'desc' }],
      take: limit,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        community: { select: { id: true, name: true, slug: true } },
      },
    });
  }
}
