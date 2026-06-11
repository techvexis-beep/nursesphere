import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMyProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.profileService.updateProfile(req.user.id, body);
  }

  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(id);
  }

  @Get(':id/posts')
  async getUserPosts(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.profileService.getUserPosts(id, page || 1, limit || 20);
  }

  @Get(':id/answers')
  async getUserAnswers(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.profileService.getUserAnswers(id, page || 1, limit || 20);
  }

  @Post(':id/follow')
  @UseGuards(AuthGuard('jwt'))
  async followUser(@Request() req: any, @Param('id') id: string) {
    return this.profileService.followUser(req.user.id, id);
  }

  @Post(':id/unfollow')
  @UseGuards(AuthGuard('jwt'))
  async unfollowUser(@Request() req: any, @Param('id') id: string) {
    return this.profileService.unfollowUser(req.user.id, id);
  }

  @Get(':id/following-status')
  @UseGuards(AuthGuard('jwt'))
  async isFollowing(@Request() req: any, @Param('id') id: string) {
    return this.profileService.isFollowing(req.user.id, id);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.profileService.getFollowers(id, page || 1, limit || 20);
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.profileService.getFollowing(id, page || 1, limit || 20);
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.profileService.searchUsers(query, page || 1, limit || 20);
  }

  @Get('recommendations')
  @UseGuards(AuthGuard('jwt'))
  async getRecommendations(@Request() req: any, @Query('limit') limit?: number) {
    return this.profileService.getRecommendedUsers(req.user.id, limit || 10);
  }
}
