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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST', 'localhost');
        const dbPort = configService.get<number>('DB_PORT', 5435);
        const dbUsername = configService.get<string>('DB_USERNAME', 'postgres');
        const dbPassword = configService.get<string>('DB_PASSWORD', 'postgres');
        const dbName = configService.get<string>('DB_NAME', 'conecta_freela');
        const dbSsl = configService.get<string>('DB_SSL') === 'true';

        console.log('--- DATABASE CONFIG ---');
        console.log('DB_SSL:', dbSsl);

        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          ssl: dbSsl ? { rejectUnauthorized: false } : false,
          synchronize: true,
          autoLoadEntities: true,
          logging: true,
        };
      }
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '');

        console.log('--- REDIS CONFIG ---');
        console.log('REDIS_HOST:', redisHost);
        console.log('REDIS_PORT:', redisPort);
        console.log('REDIS_PASSWORD:', redisPassword);

        return {
          connection: {
            host: redisHost,
            port: redisPort,
            password: redisPassword || undefined,
          },
        };
      },
    }),

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
