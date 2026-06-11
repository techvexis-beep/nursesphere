import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('communities')
  async getCommunities(@Query('type') type?: string) {
    return this.communityService.findAllCommunities(type);
  }

  @Get('communities/:slug')
  async getCommunity(@Param('slug') slug: string) {
    return this.communityService.findCommunityBySlug(slug);
  }

  @Post('communities')
  @UseGuards(AuthGuard('jwt'))
  async createCommunity(@Body() body: { name: string; description: string; type: string; icon?: string; color?: string }) {
    return this.communityService.createCommunity(body);
  }

  @Post('communities/:id/join')
  @UseGuards(AuthGuard('jwt'))
  async joinCommunity(@Param('id') id: string, @Request() req: any) {
    return this.communityService.joinCommunity(id, req.user.id);
  }

  @Post('communities/:id/leave')
  @UseGuards(AuthGuard('jwt'))
  async leaveCommunity(@Param('id') id: string, @Request() req: any) {
    return this.communityService.leaveCommunity(id, req.user.id);
  }

  @Get('communities/:id/posts')
  async getPosts(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.communityService.getCommunityPosts(id, page || 1, limit || 20);
  }

  @Post('posts')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Request() req: any, @Body() body: { communityId: string; title: string; content: string; type: string; tags?: string[] }) {
    return this.communityService.createPost({ ...body, authorId: req.user.id });
  }

  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return this.communityService.getPostById(id);
  }

  @Post('posts/:id/upvote')
  @UseGuards(AuthGuard('jwt'))
  async upvotePost(@Param('id') id: string, @Request() req: any) {
    return this.communityService.upvotePost(id, req.user.id);
  }

  @Post('posts/:id/answer')
  @UseGuards(AuthGuard('jwt'))
  async createAnswer(@Param('id') id: string, @Request() req: any, @Body() body: { content: string }) {
    return this.communityService.createAnswer(id, req.user.id, body.content);
  }

  @Post('answers/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  async acceptAnswer(@Param('id') id: string, @Request() req: any) {
    return this.communityService.acceptAnswer(id, req.user.id);
  }

  @Get('posts/:id/answers')
  async getAnswers(@Param('id') id: string) {
    return this.communityService.getPostAnswers(id);
  }

  @Post('comments')
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Request() req: any, @Body() body: { postId: string; content: string; parentId?: string }) {
    return this.communityService.createComment(body.postId, req.user.id, body.content, body.parentId);
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string) {
    return this.communityService.getPostComments(id);
  }

  @Get('feed')
  @UseGuards(AuthGuard('jwt'))
  async getFeed(@Request() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.communityService.getUserFeed(req.user.id, page || 1, limit || 20);
  }

  @Get('trending')
  async getTrending(@Query('limit') limit?: number) {
    return this.communityService.getTrendingPosts(limit || 10);
  }
}
