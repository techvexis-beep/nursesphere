import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, CreateSalaryReportDto } from './dto';

@Injectable()
export class AdvocacyService {
  constructor(private prisma: PrismaService) {}

  async createReport(userId: string | null, dto: CreateReportDto) {
    return this.prisma.advocacyReport.create({
      data: {
        userId: userId || null,
        reportType: dto.reportType,
        hospitalName: dto.hospitalName,
        country: dto.country,
        city: dto.city,
        description: dto.description,
        evidence: dto.evidence,
        isAnonymous: dto.isAnonymous ?? true,
      },
    });
  }

  async getReports(userId?: string) {
    return this.prisma.advocacyReport.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSalaryReport(userId: string, dto: CreateSalaryReportDto) {
    return this.prisma.salaryReport.create({
      data: {
        userId,
        hospitalName: dto.hospitalName,
        country: dto.country,
        city: dto.city,
        department: dto.department,
        shiftType: dto.shiftType,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        currency: dto.currency || 'USD',
        nurseToPatientRatio: dto.nurseToPatientRatio,
        benefits: dto.benefits,
        isAnonymous: dto.isAnonymous ?? true,
      },
    });
  }

  async getSalaryReports(country?: string) {
    return this.prisma.salaryReport.findMany({
      where: country ? { country } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSalaryStats() {
    const countries = await this.prisma.salaryReport.groupBy({
      by: ['country'],
      _avg: { salaryMin: true, salaryMax: true },
      _count: { id: true },
    });

    const departments = await this.prisma.salaryReport.groupBy({
      by: ['department'],
      _avg: { salaryMin: true, salaryMax: true },
      _count: { id: true },
    });

    return { countries, departments };
  }

  async getDashboardStats() {
    const totalReports = await this.prisma.advocacyReport.count();
    const pendingReports = await this.prisma.advocacyReport.count({ where: { status: 'PENDING' } });
    const resolvedReports = await this.prisma.advocacyReport.count({ where: { status: 'RESOLVED' } });
    const totalSalaryReports = await this.prisma.salaryReport.count();

    return { totalReports, pendingReports, resolvedReports, totalSalaryReports };
  }
}
