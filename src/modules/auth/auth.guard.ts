import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { env } from "../../configs/env";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import { AuthUnauthorizedException } from "../../common/exceptions/auth.unauthorized.exception";
import { FastifyRequest } from "fastify";
import { SessionsFindByIdRepository } from "../sessions/repositories/sessions.find-by-id.repository";
import { Security } from "../../utils/security.util";
import { Session } from "../sessions/sessions.entity";
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionsFindByIdRepository: SessionsFindByIdRepository,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.info = {
      method: request.method,
      url: request.protocol + "://" + request.hostname + request.originalUrl,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers,
      ip: request.ip,
      error: request.validationError,
      token: request.headers.authorization
        ? request.headers.authorization.split(" ")[1]
        : undefined,
    };

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("1");
    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
    console.log("2");
    if (!token) throw new AuthUnauthorizedException();

    try {
      const decoded = await this.jwtService.decode(token);
      console.log(decoded);
      console.log("3");
      if (decoded) throw new AuthUnauthorizedException();

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      console.log({
        currentTimeInSeconds,
        exp: decoded?.exp,
      });
      console.log("4");
      if (decoded.exp < currentTimeInSeconds) {
        const payload = {
          sessionId: decoded.sessionId,
          userId: decoded.userId,
          permissions: decoded.permissions,
        };
        console.log("4.1");
        throw new UnauthorizedException(
          "access_token:" + (await this.jwtService.signAsync(payload)),
        );
      }

      const sessionFound = await this.sessionsFindByIdRepository.execute(
        Security.decrypt(decoded.sessionId),
      );
      console.log("5");

      if (Security.hash(request.info.ip) !== sessionFound.ipAddress) {
        throw new AuthUnauthorizedException();
      }

      request.user = {
        id: decoded.userId,
        permissions: decoded.permissions,
      };
    } catch (err) {
      console.log(err);
      console.log("6");
      throw new HttpException(err.response.message, err.response.statusCode);
    }

    console.log("7");
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
