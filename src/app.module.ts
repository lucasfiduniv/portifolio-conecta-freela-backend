import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ContractsModule } from './contracts/contracts.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';
import { CommonModule } from './common/common.module';

import { configuration } from './config/configuration';
import { typeOrmConfig } from './config/typeorm.config';
import { bullMqConfig } from './config/bullmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync(typeOrmConfig),
    BullModule.forRootAsync(bullMqConfig),

    AuthModule,
    UsersModule,
    ProjectsModule,
    ProposalsModule,
    ContractsModule,
    ReviewsModule,
    MailModule,
    QueueModule,
    CommonModule,
  ],
})
export class AppModule { }
