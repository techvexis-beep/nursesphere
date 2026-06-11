import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
      },
    });
  }

  async getProfile(id: string) {
    const user = await this.findById(id);
    
    const migrationProgress = await this.prisma.migrationProgress.findUnique({
      where: { userId: id },
    });

    const stats = {
      totalClinicalLogs: await this.prisma.clinicalLog.count({ where: { userId: id } }),
      totalExamAttempts: await this.prisma.examAttempt.count({ where: { userId: id } }),
      salaryReportsCount: await this.prisma.salaryReport.count({ where: { userId: id } }),
    };

    return {
      ...user,
      migrationProgress,
      stats,
    };
  }
}
