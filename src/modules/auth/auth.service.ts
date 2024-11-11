import { Injectable } from "@nestjs/common";
import { UsersFindByUsernameRepository } from "../users/repositories/users.find-by-username.repository";
import { Security } from "../../utils/security.util";
import { AuthInvalidCredentialException } from "../../common/exceptions/auth.invalid-credential.exception";
import * as bcrypt from "bcrypt";
import { UsersDto } from "../users/dtos/users.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthResponseDto } from "./dtos/auth.dto";
import { SessionsCreateRepository } from "../sessions/repositories/sessions.create.repository";
import { env } from "../../configs/env";
import { Session } from "../sessions/sessions.entity";
import { SessionsRevokedAllRepository } from "../sessions/repositories/sessions.revoked-all.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersFindByUsernameRepository: UsersFindByUsernameRepository,
    private readonly sessionsCreateRepository: SessionsCreateRepository,
    private readonly sessionsRevokedAllRepository: SessionsRevokedAllRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
    ipAddress: string,
  ): Promise<AuthResponseDto> {
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
    if (!passwordIsValid) {
      throw new AuthInvalidCredentialException();
    }

    const expiresAt = new Date(new Date().getTime() + Number(env.JWT_EXPIRES));

    await this.sessionsRevokedAllRepository.execute(userFound.id);

    const SessionEntity = new Session();
    SessionEntity.create = {
      userId: userFound.id,
      expiresAt,
      ipAddress,
    };

    const sessionCreate = await this.sessionsCreateRepository.execute(
      SessionEntity.toJson,
    );

    const payload = {
      sessionId: Security.encrypt(sessionCreate.id),
      userId: Security.encrypt(userFound.id),
      permissions: Security.encrypt(JSON.stringify(userFound.permissions)),
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
