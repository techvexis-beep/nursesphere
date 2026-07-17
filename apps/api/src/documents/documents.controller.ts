import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getDocuments(@Request() req: any, @Query('category') category?: string) {
    return this.documentsService.getUserDocuments(req.user?.id || 'demo-user-id', category);
  }

  @Get('stats')
  async getDocumentStats(@Request() req: any) {
    return this.documentsService.getDocumentStats(req.user?.id || 'demo-user-id');
  }

  @Get(':id')
  async getDocumentById(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.getDocumentById(id, req.user?.id || 'demo-user-id');
  }

  @Post()
  async createDocument(
    @Request() req: any,
    @Body() data: {
      name: string;
      type: string;
      category: string;
      fileUrl: string;
      fileSize?: number;
      mimeType?: string;
      expiresAt?: Date;
    },
  ) {
    return this.documentsService.createDocument(req.user?.id || 'demo-user-id', data);
  }

  @Put(':id')
  async updateDocument(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      expiresAt?: Date;
    },
  ) {
    return this.documentsService.updateDocument(id, req.user?.id || 'demo-user-id', data);
  }

  @Delete(':id')
  async deleteDocument(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.deleteDocument(id, req.user?.id || 'demo-user-id');
  }

  @Put(':id/verify')
  async verifyDocument(@Param('id') id: string, @Request() req: any) {
    return this.documentsService.verifyDocument(id, req.user?.id || 'demo-user-id');
  }
}
