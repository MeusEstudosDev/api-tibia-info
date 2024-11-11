import { Inject, Injectable } from "@nestjs/common";
import { UsersUpdateDto } from "../dtos/users.update.dto";
import { User } from "../users.entity";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { UsersAlreadyExistsRepository } from "../repositories/users.already-exists.repository";
import { UsersDto, UsersResponseDto } from "../dtos/users.dto";
import { UsersUpdateRepository } from "../repositories/users.update.repository";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Security } from "../../../utils/security.util";

@Injectable()
export class UsersUpdateUseCase {
  constructor(
    private readonly usersFindByIdRepository: UsersFindByIdRepository,
    private readonly usersAlreadyExistsRepository: UsersAlreadyExistsRepository,
    private readonly usersUpdateRepository: UsersUpdateRepository,

    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async execute(
    dto: UsersUpdateDto,
    userId: string,
  ): Promise<UsersResponseDto> {
    userId = Security.decrypt(userId);
    const userFound = await this.usersFindByIdRepository.execute(userId);

    const UserEntity = new User(userFound);
    UserEntity.update = dto;

    const userJson: UsersDto = UserEntity.toJson;

    await this.usersAlreadyExistsRepository.execute(
      {
        username: userJson.username,
        email: userJson.email,
      },
      userId,
    );

    await this.usersUpdateRepository.execute(UserEntity.toJson);

    await this.cache.set(userJson.id, JSON.stringify(UserEntity.response), {
      ttl: 60 * 5,
    });

    return UserEntity.response;
  }
}
