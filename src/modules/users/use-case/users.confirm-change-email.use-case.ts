import { Injectable } from "@nestjs/common";
import { RedisService } from "../../../providers/redis/redis.service";
import { UsersChangeEmailNotExistsException } from "../../../common/exceptions/users.change-email-not-exsits.exception";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { Security } from "../../../utils/security.util";
import { User } from "../users.entity";
import { UsersUpdateRepository } from "../repositories/users.update.repository";

@Injectable()
export class UsersConfirmChangeEmailUseCase {
  constructor(
    private readonly redis: RedisService,
    private readonly usersFindByIdRepository: UsersFindByIdRepository,
    private readonly usersUpdateRepository: UsersUpdateRepository,
  ) {}

  async execute(userId: string) {
    userId = Security.decrypt(userId);

    const changeEmailExists = await this.redis.get(`change-email:${userId}`);
    if (!changeEmailExists) throw new UsersChangeEmailNotExistsException();

    const newEmail = JSON.parse(changeEmailExists).email;

    const userFound = await this.usersFindByIdRepository.execute(userId);

    const UserEntity = new User(userFound);
    UserEntity.email = newEmail;
    await this.usersUpdateRepository.execute(UserEntity.toJson);

    this.redis.del(`change-email:${userId}`);

    return;
  }
}
