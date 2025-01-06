import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { User } from "../users.entity";
import { Security } from "../../../utils/security.util";
import { UsersUpdateRepository } from "../repositories/users.update.repository";
import { RedisService } from "../../../providers/redis/redis.service";
import { UsersPasswordChangeDoesNotExistException } from "../../../common/exceptions/users.password-change-does-not-exist.exception";

@Injectable()
export class UsersChangePasswordUseCase {
  constructor(
    private readonly redis: RedisService,
    private readonly usersFindByIdRepository: UsersFindByIdRepository,
    private readonly usersUpdateRepository: UsersUpdateRepository,
  ) {}

  async execute(userId: string, password: string) {
    userId = Security.decrypt(userId);
    password = Security.decrypt(password);

    const userFound = await this.usersFindByIdRepository.execute(userId);

    const userForgotPasswordExists = await this.redis.get(
      `forgot-password:${userId}`,
    );
    if (!userForgotPasswordExists) {
      throw new UsersPasswordChangeDoesNotExistException();
    }

    const UserEntity = new User(userFound);
    console.log("a", UserEntity.toJson.passwordHash);
    UserEntity.changePassword(password);
    const x = await this.usersUpdateRepository.execute(UserEntity.toJson);

    console.log("b", UserEntity.toJson.passwordHash);
    // this.redis.del(`forgot-password:${userId}`);

    return { message: "Senha alterada com sucesso" };
  }
}
