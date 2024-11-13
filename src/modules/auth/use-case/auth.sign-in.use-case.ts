import { Injectable } from "@nestjs/common";
import { UsersFindByUsernameRepository } from "../../users/repositories/users.find-by-username.repository";
import { Security } from "../../../utils/security.util";
import { AuthInvalidCredentialException } from "../../../common/exceptions/auth.invalid-credential.exception";
import * as bcrypt from "bcrypt";
import { UsersDto } from "../../users/dtos/users.dto";
import { JwtService } from "@nestjs/jwt";
import { SessionsCreateRepository } from "../../sessions/repositories/sessions.create.repository";
import { env } from "../../../configs/env";
import { Session } from "../../sessions/sessions.entity";
import { SessionsRevokedAllRepository } from "../../sessions/repositories/sessions.revoked-all.repository";
import { FastifyReply } from "fastify";
import { MessageDto } from "../../../common/dtos/message.dto";
import { JwtPayloadDto } from "../../../common/dtos/jwt-payload.dto";

@Injectable()
export class AuthSignInUseCase {
  constructor(
    private readonly usersFindByUsernameRepository: UsersFindByUsernameRepository,
    private readonly sessionsCreateRepository: SessionsCreateRepository,
    private readonly sessionsRevokedAllRepository: SessionsRevokedAllRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    username: string,
    password: string,
    ipAddress: string,
    res: FastifyReply,
  ): Promise<MessageDto> {
    let userFound: UsersDto;

    try {
      userFound = await this.usersFindByUsernameRepository.execute(
        Security.hash(username),
      );
    } catch {
      throw new AuthInvalidCredentialException();
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      userFound.passwordHash,
    );
    if (!passwordIsValid) throw new AuthInvalidCredentialException();

    const expiresAt = new Date(new Date().getTime() + Number(env.JWT_EXPIRES));

    const userId = userFound.id;

    const SessionEntity = new Session();
    SessionEntity.create = {
      userId,
      expiresAt,
      ipAddress,
    };

    await this.sessionsRevokedAllRepository.execute(userId);

    const sessionCreate = await this.sessionsCreateRepository.execute(
      SessionEntity.toJson,
    );

    const payload: JwtPayloadDto = {
      sessionId: Security.encrypt(sessionCreate.id),
      userId: Security.encrypt(userId),
      permissions: Security.encrypt(JSON.stringify(userFound.permissions)),
    };
    const accessToken = await this.jwtService.signAsync(payload);
    res.setCookie("accessToken", accessToken, { path: "/" });
    return { message: "Usuário autenticado com sucesso" };
  }
}
