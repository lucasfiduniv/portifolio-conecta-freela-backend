import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { MailModule } from '../mail/mail.module';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    MailModule,
  ],
  providers: [QueueService, EmailProcessor],
  exports: [QueueService],
})
export class QueueModule { }