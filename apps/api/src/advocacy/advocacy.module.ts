import { Module } from '@nestjs/common';
import { AdvocacyService } from './advocacy.service';
import { AdvocacyController } from './advocacy.controller';

@Module({
  controllers: [AdvocacyController],
  providers: [AdvocacyService],
  exports: [AdvocacyService],
})
export class AdvocacyModule {}
