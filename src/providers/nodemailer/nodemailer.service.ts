import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env } from "../../configs/env";
import { Logger } from "@nestjs/common/services/logger.service";

interface SendEmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const from = `"Equipe Tibia-Info" <${env.SMTP_USER}>`;
    const mailOptions = { ...dto, from };

    try {
      await this.transporter.sendMail(mailOptions);
      Logger.warn(`📧 Email enviado para ${dto.to}`, "NodemailerService");
      return;
    } catch (err) {
      Logger.error(err, "NodemailerService");
    }
  }
}
