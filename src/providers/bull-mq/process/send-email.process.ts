import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Worker } from "bullmq";
import { env } from "../../../configs/env";
import { NodemailerService } from "../../nodemailer/nodemailer.service";

@Processor("send-email")
export class SendEmail extends WorkerHost {
  constructor(private readonly nodemailerService: NodemailerService) {
    super();

    new Worker(
      "send-email",
      async (job: Job): Promise<void> => {
        return this.process(job);
      },
      {
        concurrency: 1,
        connection: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      },
    );
  }

  async process(job: Job): Promise<void> {
    await job.updateProgress(10);
    await this.nodemailerService.sendEmail(JSON.parse(job.data));
    await job.updateProgress(100);
    return;
  }
}
