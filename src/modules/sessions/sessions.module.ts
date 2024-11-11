import { Module } from "@nestjs/common";
import { SessionsCreateRepository } from "./repositories/sessions.create.repository";
import { PrismaModule } from "../../providers/prisma/prisma.module";
import { SessionsRevokedAllRepository } from "./repositories/sessions.revoked-all.repository";
import { SessionsFindByIdRepository } from "./repositories/sessions.find-by-id.repository";

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    SessionsCreateRepository,
    SessionsRevokedAllRepository,
    SessionsFindByIdRepository,
  ],
  exports: [
    SessionsCreateRepository,
    SessionsRevokedAllRepository,
    SessionsFindByIdRepository,
  ],
})
export class SessionsModule {}
