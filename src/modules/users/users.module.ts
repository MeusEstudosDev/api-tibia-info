import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersCreateRepository } from "./repositories/users.create.repository";
import { UsersCreateUseCase } from "./use-case/users.create.use-case";
import { PrismaModule } from "../../providers/prisma/prisma.module";
import { UsersAlreadyExistsRepository } from "./repositories/users.already-exists.repository";
import { UsersFindByIdRepository } from "./repositories/users.find-by-id.repository";
import { RedisModule } from "../../providers/redis/redis.module";
import { BullMqQueueModule } from "../../providers/bull-mq/bull-mq.module";
import { UsersFindByUsernameRepository } from "./repositories/users.find-by-username.repository";
import { UsersProfileUseCase } from "./use-case/users.profile.use-case";
import { UsersUpdateRepository } from "./repositories/users.update.repository";
import { UsersUpdateUseCase } from "./use-case/users.update.use-case";
import { UsersConfirmChangeEmailUseCase } from "./use-case/users.confirm-change-email.use-case";
import { UsersChangeEmailUseCase } from "./use-case/users.change-email.use-case";
import { NodemailerModule } from "../../providers/nodemailer/nodemailer.module";
import { UsersFindByEmailRepository } from "./repositories/users.find-by-email.repository";
import { UsersForgotPasswordUseCase } from "./use-case/users.forgot-password";
import { UsersChangePasswordUseCase } from "./use-case/users.change-password.use-case";

@Module({
  imports: [PrismaModule, RedisModule, BullMqQueueModule, NodemailerModule],
  controllers: [UsersController],
  providers: [
    UsersCreateUseCase,
    UsersProfileUseCase,
    UsersUpdateUseCase,
    UsersChangeEmailUseCase,
    UsersConfirmChangeEmailUseCase,
    UsersForgotPasswordUseCase,
    UsersChangePasswordUseCase,

    UsersCreateRepository,
    UsersAlreadyExistsRepository,
    UsersFindByIdRepository,
    UsersFindByUsernameRepository,
    UsersUpdateRepository,
    UsersFindByEmailRepository,
  ],
  exports: [UsersFindByUsernameRepository, UsersFindByIdRepository],
})
export class UsersModule {}
