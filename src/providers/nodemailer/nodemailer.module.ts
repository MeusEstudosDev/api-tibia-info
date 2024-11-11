import { forwardRef, Module } from "@nestjs/common";
import { NodemailerSendEmailService } from "./services/nodemailer-send-email.service";
import { NodemailerService } from "./nodemailer.service";
import { BullMqQueueModule } from "../bull-mq/bull-mq.module";

@Module({
  imports: [forwardRef(() => BullMqQueueModule)],
  providers: [NodemailerService, NodemailerSendEmailService],
  exports: [NodemailerService, NodemailerSendEmailService],
})
export class NodemailerModule {}
