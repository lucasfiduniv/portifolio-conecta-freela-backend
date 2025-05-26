import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    // Database using DATABASE_URL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        console.log('--- DATABASE CONFIG ---');
        console.log('DATABASE_URL:', databaseUrl);

        try {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            synchronize: true,
            autoLoadEntities: true,
            logging: true,
          };
        } catch (error) {
          console.error('Erro ao configurar TypeORM:', error);
          throw error;
        }
      },
    }),



    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
    }),

    // Feature modules
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
