import { Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { RegulatorController } from './regulator.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegulatorController],
  providers: [RegulatorService],
  exports: [RegulatorService],
})
export class RegulatorModule {}
