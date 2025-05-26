import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailService } from '../../mail/mail.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  
  constructor(private mailService: MailService) {}
  
  @Process('send-email')
  async handleSendEmail(job: Job<{
    to: string;
    subject: string;
    template: string;
    context: any;
  }>): Promise<void> {
    this.logger.debug(`Processing email job ${job.id}`);
    
    const { to, subject, template, context } = job.data;
    
    try {
      // Get template HTML
      const html = this.mailService.getTemplate(template, context);
      
      // Send email
      await this.mailService.sendMail({
        to,
        subject,
        html,
      });
      
      this.logger.debug(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}