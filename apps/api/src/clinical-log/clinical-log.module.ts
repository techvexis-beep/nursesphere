import { Module } from '@nestjs/common';
import { ClinicalLogService } from './clinical-log.service';
import { ClinicalLogController } from './clinical-log.controller';

@Module({
  controllers: [ClinicalLogController],
  providers: [ClinicalLogService],
  exports: [ClinicalLogService],
})
export class ClinicalLogModule {}
