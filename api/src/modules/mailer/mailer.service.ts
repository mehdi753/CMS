import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MAIL, MAIL_ACTION } from 'src/@types/mail-templates';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SENDGRID.HOST'),
      port: this.configService.get('SENDGRID.PORT_SSL'),
      secure: true,
      auth: {
        user: this.configService.get('SENDGRID.USERNAME'),
        pass: this.configService.get('SENDGRID.PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string,
    action: MAIL_ACTION,
    options?: Record<string, string | number>,
  ): Promise<void> {
    const mail = MAIL[action];
    const mailContent = await this.loadTemplate(mail.templateName, options);
    this.transporter.sendMail({
      from: this.configService.get('SENDGRID.SENDER'),
      to,
      subject: mail.subject,
      html: mailContent,
    });
  }

  private async loadTemplate(
    templateName: string,
    options?: Record<string, string | number>,
  ) {
    let template = await fs.readFileSync(
      join(
        __dirname,
        '../../../..',
        'public/',
        'mail-templates/',
        `${templateName}.html`,
      ),
      'utf8',
    );
    if (options && Object.keys(options).length) {
      template = template.replace(
        /{{.*?}}/g,
        (match) => `${options[match.replace(/{{|}}/g, '')]}`,
      );
    }
    return template;
  }
}
