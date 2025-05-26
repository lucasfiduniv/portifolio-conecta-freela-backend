import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) { }

  async addNotification(data: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }): Promise<void> {
    await this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
}