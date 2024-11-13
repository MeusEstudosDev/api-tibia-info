import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { FastifyReply } from "fastify";
import { MessageDto } from "../../../common/dtos/message.dto";
import { SessionsRevokedAllRepository } from "../../sessions/repositories/sessions.revoked-all.repository";
import { Security } from "../../../utils/security.util";
import { RedisService } from "../../../providers/redis/redis.service";

@Injectable()
export class AuthSignOutUseCase {
  constructor(
    private readonly sessionsRevokedAllRepository: SessionsRevokedAllRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(
    id: string,
    token: string,
    res: FastifyReply,
  ): Promise<MessageDto> {
    await this.sessionsRevokedAllRepository.execute(Security.decrypt(id));
    res.setCookie("accessToken", "", { path: "/", maxAge: 0 });
    this.redis.del(token);
    return { message: "Sign out successfully" };
  }
}
