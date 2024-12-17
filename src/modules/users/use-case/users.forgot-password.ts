import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { UsersFindByEmailRepository } from "../repositories/users.find-by-email.repository";
import { RedisService } from "../../../providers/redis/redis.service";
import { Security } from "../../../utils/security.util";
import { UsersAlreadyExistsRepository } from "../repositories/users.already-exists.repository";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { NodemailerSendEmailService } from "../../../providers/nodemailer/services/nodemailer-send-email.service";
import { UsersForgotPasswordExistsException } from "../../../common/exceptions/users.forgot-password-exists.exception";
import { UsersDto } from "../dtos/users.dto";
import { env } from "../../../configs/env";

@Injectable()
export class UsersForgotPasswordUseCase {
  constructor(
    private readonly redis: RedisService,
    private readonly usersAlreadyExistsRepository: UsersAlreadyExistsRepository,
    private readonly usersFindByEmailRepository: UsersFindByEmailRepository,
    private readonly nodemailerSendEmailService: NodemailerSendEmailService,
    private readonly usersFindByIdRepository: UsersFindByIdRepository,
  ) {}

  async execute(email: string) {
    const userFound = await this.usersFindByEmailRepository.execute(
      Security.hash(email),
    );

    const forgotPasswordExists = await this.redis.get(
      `forgot-password:${userFound.id}`,
    );
    if (forgotPasswordExists) throw new UsersForgotPasswordExistsException();

    await this.usersAlreadyExistsRepository.execute(
      { email: Security.hash(email) },
      userFound.id,
    );

    await this.redis.set(
      `forgot-password:${userFound.id}`,
      JSON.stringify({ email }),
      60 * 5,
    );

    const userCacheExists = await this.redis.get(userFound.id);

    let user: UsersDto;

    if (userCacheExists) {
      user = JSON.parse(userCacheExists);
    } else {
      user = await this.usersFindByIdRepository.execute(userFound.id);
      await this.redis.set(userFound.id, JSON.stringify(user));
    }

    await this.nodemailerSendEmailService.execute({
      email: email,
      subject: "Alteração de senha",
      name: `${user.firstName} ${user.lastName}`,
      link:
        env.URL_FRONT +
        "/change-password?userId=" +
        Security.encrypt(userFound.id),
      fileName: "change-password-user.hbs",
    });

    return { message: "Alteração de senha enviada com sucesso" };
  }
}
