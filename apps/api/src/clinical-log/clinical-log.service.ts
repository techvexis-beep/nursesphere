import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicalLogDto, UpdateClinicalLogDto } from './dto';

@Injectable()
export class ClinicalLogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateClinicalLogDto) {
    return this.prisma.clinicalLog.create({
      data: {
        userId,
        caseTitle: dto.caseTitle,
        caseType: dto.caseType,
        description: dto.description,
        patientAge: dto.patientAge,
        patientGender: dto.patientGender,
        diagnosis: dto.diagnosis,
        intervention: dto.intervention,
        outcome: dto.outcome,
        supervisorName: dto.supervisorName,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.clinicalLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const log = await this.prisma.clinicalLog.findFirst({
      where: { id, userId },
    });

    if (!log) {
      throw new NotFoundException('Clinical log not found');
    }

    return log;
  }

  async update(id: string, userId: string, dto: UpdateClinicalLogDto) {
    await this.findOne(id, userId);

    return this.prisma.clinicalLog.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.clinicalLog.delete({
      where: { id },
    });
  }

  async approve(id: string, supervisorId: string) {
    return this.prisma.clinicalLog.update({
      where: { id },
      data: {
        supervisorApproval: true,
        supervisorSignature: supervisorId,
        isVerified: true,
      },
    });
  }

  async getStats(userId: string) {
    const total = await this.prisma.clinicalLog.count({ where: { userId } });
    const verified = await this.prisma.clinicalLog.count({ where: { userId, isVerified: true } });
    const pending = await this.prisma.clinicalLog.count({ where: { userId, supervisorApproval: false } });

    return { total, verified, pending };
  }
}
