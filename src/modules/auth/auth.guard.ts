import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import { AuthUnauthorizedException } from "../../common/exceptions/auth.unauthorized.exception";
import { FastifyReply, FastifyRequest } from "fastify";
import { SessionsFindByIdRepository } from "../sessions/repositories/sessions.find-by-id.repository";
import { Security } from "../../utils/security.util";
import { JwtPayloadDto } from "../../common/dtos/jwt-payload.dto";
import { JwtDecodeDto } from "../../common/dtos/jwt-decode.dto";
import { SessionsDto } from "../sessions/dtos/sessions.dto";
import { RedisService } from "../../providers/redis/redis.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionsFindByIdRepository: SessionsFindByIdRepository,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest<FastifyRequest>();

    this.logInfo(request);

    if (this.isPublicRoute(context)) return true;

    const token: string = request.cookies?.accessToken;
    if (!token) throw new AuthUnauthorizedException();

    const response: FastifyReply = context.switchToHttp().getResponse();
    try {
      let decoded: JwtDecodeDto;
      const decodedCache: string = await this.redis.get(token);
      if (decodedCache) {
        decoded = JSON.parse(decodedCache);
      } else {
        decoded = await this.jwtService.decode(token);
        this.validateDecodedToken(decoded);
        await this.redis.set(token, JSON.stringify(decoded), 60);
      }

      await this.verifySession(request, decoded);
      this.attachUserToRequest(request, decoded);

      const currentTimeInSeconds: number = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimeInSeconds) {
        await this.handleTokenExpiration(decoded, response);
      }
    } catch {
      response.setCookie("accessToken", "", { path: "/", maxAge: 0 });
      this.redis.del(token);
      throw new AuthUnauthorizedException();
    }

    return true;
  }

  private logInfo(request: FastifyRequest): void {
    request.info = {
      method: request.method,
      url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers,
      ip: request.ip,
      error: request.validationError,
      token: request.cookies?.accessToken,
    };
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async handleTokenExpiration(
    decoded: JwtDecodeDto,
    response: FastifyReply,
  ): Promise<boolean> {
    const payload: JwtPayloadDto = {
      sessionId: decoded.sessionId,
      userId: decoded.userId,
      permissions: decoded.permissions,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);
    response.setCookie("accessToken", accessToken, { path: "/" });
    return true;
  }

  private validateDecodedToken(decoded: JwtDecodeDto): void {
    if (!decoded) throw new AuthUnauthorizedException();
  }

  private async verifySession(
    request: FastifyRequest,
    decoded: JwtDecodeDto,
  ): Promise<void> {
    const sessionId: string = Security.decrypt(decoded.sessionId);

    const sessionFound: SessionsDto =
      await this.sessionsFindByIdRepository.execute(sessionId);
    const ipAddress: string = sessionFound.ipAddress;

    if (!ipAddress || request.info.ip !== ipAddress) {
      this.redis.del(`ipAddress:${sessionId}`);
      throw new AuthUnauthorizedException();
    }
  }

  private attachUserToRequest(
    request: FastifyRequest,
    decoded: JwtDecodeDto,
  ): void {
    request.user = {
      id: decoded.userId,
      permissions: decoded.permissions,
    };
  }
}
