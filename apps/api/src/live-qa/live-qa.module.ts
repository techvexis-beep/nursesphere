import { Module } from '@nestjs/common';
import { LiveQAService } from './live-qa.service';
import { LiveQAController } from './live-qa.controller';
import { LiveQAGateway } from './live-qa.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LiveQAController],
  providers: [LiveQAGateway, LiveQAService],
  exports: [LiveQAService],
})
export class LiveQAModule {}
