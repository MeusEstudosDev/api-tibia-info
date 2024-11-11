import { Injectable } from "@nestjs/common";
import { resolve } from "path";
import fs from "node:fs";
import handlebars from "handlebars";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ROOT_DIR } from "../../../configs/root_dir";

interface SendEmailDto {
  name: string;
  email: string;
  fileName: string;
  link: string;
  subject: string;
}

@Injectable()
export class NodemailerSendEmailService {
  constructor(
    @InjectQueue("send-email") private readonly sendEmailQueue: Queue,
  ) {}

  async execute(dto: SendEmailDto): Promise<string> {
    const { fileName, name, link, email, subject } = dto;

    const template = resolve(
      ROOT_DIR,
      "src",
      "providers",
      "nodemailer",
      "templates",
      fileName,
    );

    const templateFileContent = await fs.promises.readFile(template, {
      encoding: "utf-8",
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    const html = parseTemplate({ name, link });

    const emailData = JSON.stringify({
      to: email,
      subject,
      html,
    });

    await this.sendEmailQueue.add("transcode", emailData);

    return;
  }
}
