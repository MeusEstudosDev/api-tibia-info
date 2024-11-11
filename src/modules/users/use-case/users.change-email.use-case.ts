import { Injectable } from "@nestjs/common";
import { RedisService } from "../../../providers/redis/redis.service";
import { UsersChangeEmailAlreadyExistsException } from "../../../common/exceptions/users.change-email-already-exists.exception";
import { UsersAlreadyExistsRepository } from "../repositories/users.already-exists.repository";
import { UsersDto } from "../dtos/users.dto";
import { env } from "../../../configs/env";
import { Security } from "../../../utils/security.util";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { NodemailerSendEmailService } from "../../../providers/nodemailer/services/nodemailer-send-email.service";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { MessageDto } from "../../../common/dtos/message.dto";

@Injectable()
export class UsersChangeEmailUseCase {
  constructor(
    private readonly redis: RedisService,
    private readonly usersAlreadyExistsRepository: UsersAlreadyExistsRepository,
    private readonly nodemailerSendEmailService: NodemailerSendEmailService,
    private readonly usersFindByIdRepository: UsersFindByIdRepository,

    @InjectQueue("send-email") private readonly sendEmailQueue: Queue,
  ) {}

  async execute(newEmail: string, userId: string): Promise<MessageDto> {
    userId = Security.decrypt(userId);

    const changeEmailExists = await this.redis.get(`change-email:${userId}`);
    if (changeEmailExists) throw new UsersChangeEmailAlreadyExistsException();

    await this.usersAlreadyExistsRepository.execute(
      { email: Security.hash(newEmail) },
      userId,
    );

    await this.redis.set(
      `change-email:${userId}`,
      JSON.stringify({ email: newEmail }),
      60 * 5,
    );

    const userCacheExists = await this.redis.get(userId);

    let user: UsersDto;

    if (userCacheExists) {
      user = JSON.parse(userCacheExists);
    } else {
      user = await this.usersFindByIdRepository.execute(userId);
      await this.redis.set(userId, JSON.stringify(user));
    }

    await this.nodemailerSendEmailService.execute({
      email: newEmail,
      subject: "Alteração de e-mail",
      name: `${user.firstName} ${user.lastName}`,
      link:
        env.URL_BACK +
        "/users/change-email-self-confirm/" +
        Security.encrypt(userId),
      fileName: "change-email-user.hbs",
    });

    return { message: "E-mail de confirmação enviado com sucesso" };
  }
}
