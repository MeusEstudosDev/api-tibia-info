import { forwardRef, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { SendEmail } from "./process/send-email.process";
import { NodemailerModule } from "../nodemailer/nodemailer.module";

@Module({
  imports: [
    forwardRef(() => NodemailerModule),
    BullModule.registerQueue({
      name: "send-email",
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnFail: false,
        removeOnComplete: true,
      },
    }),
  ],
  providers: [SendEmail],
  exports: [BullModule, SendEmail],
})
export class BullMqQueueModule {}
