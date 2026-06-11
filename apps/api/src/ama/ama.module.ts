import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AMAController } from './ama.controller';
import { AMAService } from './ama.service';

@Module({
  imports: [PrismaModule],
  controllers: [AMAController],
  providers: [AMAService],
  exports: [AMAService],
})
export class AMAModule {}
