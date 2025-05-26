import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../../mail/mail.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { to, subject, template, context } = job.data;

    this.logger.debug(`📩 Processando job de e-mail: ${job.id}`);

    try {
      const html = this.mailService.getTemplate(template, context);
      await this.mailService.sendMail({ to, subject, html });

      this.logger.debug(`✅ Email enviado para: ${to}`);
    } catch (error) {
      this.logger.error(`❌ Falha ao enviar email: ${error.message}`);
      throw error;
    }
  }
}
