import { Inject, Injectable } from "@nestjs/common";
import { Security } from "../../../utils/security.util";
import { UsersFindByIdRepository } from "../repositories/users.find-by-id.repository";
import { User } from "../users.entity";
import { UsersResponseDto } from "../dtos/users.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class UsersProfileUseCase {
  constructor(
    private readonly usersFindByIdRepository: UsersFindByIdRepository,

    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async execute(userIdHash: string): Promise<UsersResponseDto> {
    const userId = Security.decrypt(userIdHash);
    const userCacheFound = await this.cache.get(userId);
    if (userCacheFound) return JSON.parse(userCacheFound as string);
    const userFound = await this.usersFindByIdRepository.execute(userId);
    const user = new User(userFound);
    await this.cache.set(userFound.id, JSON.stringify(user.response), {
      ttl: 60 * 5,
    });
    return user.response;
  }
}
