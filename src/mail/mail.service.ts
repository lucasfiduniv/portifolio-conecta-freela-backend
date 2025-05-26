import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private isDev: boolean;
  private outputDir: string;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get<string>('nodeEnv');
    this.isDev = environment !== 'production';

    if (this.isDev) {
      // Diretório para salvar e-mails localmente
      this.outputDir = path.join(process.cwd(), 'emails');
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Transport local usando buffer
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
      });
    } else {
      // Transport real para produção
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('mail.host'),
        port: this.configService.get<number>('mail.port'),
        secure: this.configService.get<boolean>('mail.secure'),
        auth: {
          user: this.configService.get<string>('mail.auth.user'),
          pass: this.configService.get<string>('mail.auth.pass'),
        },
      });
    }
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void> {
    const mailOptions = {
      from: options.from || this.configService.get<string>('mail.from'),
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await this.transporter.sendMail(mailOptions);

    // Se estiver em desenvolvimento, salvar e-mail como arquivo
    if (this.isDev && info.message) {
      const fileName = `${Date.now()}-${options.to.replace(/[@.]/g, '_')}.eml`;
      const filePath = path.join(this.outputDir, fileName);
      fs.writeFileSync(filePath, info.message);
      console.log(`📩 Email salvo em: ${filePath}`);
    }
  }

  getTemplate(template: string, context: any): string {
    const templates: Record<string, string> = {
      'new-proposal': `
        <h1>Nova Proposta Recebida</h1>
        <p>Olá ${context.clientName},</p>
        <p>Você recebeu uma nova proposta para o projeto "${context.projectTitle}".</p>
        <p>Acesse a plataforma para visualizá-la.</p>
      `,
      'proposal-accepted': `
        <h1>Sua Proposta Foi Aceita!</h1>
        <p>Olá ${context.freelancerName},</p>
        <p>Parabéns! Sua proposta para "${context.projectTitle}" foi aceita.</p>
        <p>O cliente criará um contrato em breve.</p>
      `,
      'contract-created-client': `
        <h1>Contrato Criado</h1>
        <p>Olá ${context.clientName},</p>
        <p>Seu contrato com ${context.freelancerName} para "${context.projectTitle}" foi criado.</p>
        <ul>
          <li>Entrega: ${context.deliveryDate.toDateString()}</li>
          <li>Preço: R$${context.price}</li>
        </ul>
      `,
      'contract-created-freelancer': `
        <h1>Contrato Criado</h1>
        <p>Olá ${context.freelancerName},</p>
        <p>Um contrato com ${context.clientName} para "${context.projectTitle}" foi criado.</p>
        <ul>
          <li>Entrega: ${context.deliveryDate.toDateString()}</li>
          <li>Preço: R$${context.price}</li>
        </ul>
      `,
      'contract-completed': `
        <h1>Contrato Concluído</h1>
        <p>Olá ${context.freelancerName},</p>
        <p>O contrato para "${context.projectTitle}" foi marcado como concluído.</p>
        <p>O cliente poderá deixar uma avaliação.</p>
      `,
    };

    return templates[template] || `<p>Template não encontrado: ${template}</p>`;
  }
}
