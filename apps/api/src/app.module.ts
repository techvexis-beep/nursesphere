import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MigrationModule } from './migration/migration.module';
import { ClinicalLogModule } from './clinical-log/clinical-log.module';
import { ExamModule } from './exam/exam.module';
import { AdvocacyModule } from './advocacy/advocacy.module';
import { JobsModule } from './jobs/jobs.module';
import { AiModule } from './ai/ai.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';
import { RegulatorModule } from './regulator/regulator.module';
import { LiveQAModule } from './live-qa/live-qa.module';
import { CommunityModule } from './community/community.module';
import { ProfileModule } from './profile/profile.module';
import { ReputationModule } from './reputation/reputation.module';
import { AMAModule } from './ama/ama.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MigrationModule,
    ClinicalLogModule,
    ExamModule,
    AdvocacyModule,
    JobsModule,
    AiModule,
    DocumentsModule,
    NotificationsModule,
    EventsModule,
    RegulatorModule,
    LiveQAModule,
    CommunityModule,
    ProfileModule,
    ReputationModule,
    AMAModule,
    MessagesModule,
  ],
})
export class AppModule {}
