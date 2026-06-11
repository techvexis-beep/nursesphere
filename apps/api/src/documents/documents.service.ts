import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getUserDocuments(userId: string, category?: string) {
    const where: any = { userId };
    if (category) where.category = category;

    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('Not authorized to view this document');
    }

    return document;
  }

  async createDocument(
    userId: string,
    data: {
      name: string;
      type: string;
      category: string;
      fileUrl: string;
      fileSize?: number;
      mimeType?: string;
      expiresAt?: Date;
    },
  ) {
    return this.prisma.document.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateDocument(
    documentId: string,
    userId: string,
    data: {
      name?: string;
      expiresAt?: Date;
    },
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this document');
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data,
    });
  }

  async deleteDocument(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this document');
    }

    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }

  async getDocumentStats(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
    });

    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const verified = documents.filter(d => d.isVerified).length;
    const expiringSoon = documents.filter(d => {
      if (!d.expiresAt) return false;
      const daysUntilExpiry = Math.ceil((d.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    return {
      total: documents.length,
      verified,
      expiringSoon,
      byCategory,
    };
  }

  async verifyDocument(documentId: string, adminId: string) {
    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }
}
