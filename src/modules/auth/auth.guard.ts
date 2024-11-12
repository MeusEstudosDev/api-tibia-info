import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import { AuthUnauthorizedException } from "../../common/exceptions/auth.unauthorized.exception";
import { FastifyRequest } from "fastify";
import { SessionsFindByIdRepository } from "../sessions/repositories/sessions.find-by-id.repository";
import { Security } from "../../utils/security.util";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionsFindByIdRepository: SessionsFindByIdRepository,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse();

    this.logInfo(request);

    if (this.isPublicRoute(context)) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new AuthUnauthorizedException();

    try {
      const decoded = await this.jwtService.decode(token);
      this.validateDecodedToken(decoded);

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimeInSeconds) {
        await this.handleTokenExpiration(decoded, response);
      }

      await this.verifySession(request, decoded);
      this.attachUserToRequest(request, decoded);
    } catch {
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
      token: this.extractTokenFromHeader(request),
    };
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private async handleTokenExpiration(decoded: any, response: any) {
    const payload = {
      sessionId: decoded.sessionId,
      userId: decoded.userId,
      permissions: decoded.permissions,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    response.setCookie("accessToken", accessToken, {
      path: "/",
    });
    return true;
  }

  private validateDecodedToken(decoded: any) {
    if (!decoded) throw new AuthUnauthorizedException();
  }

  private async verifySession(request: FastifyRequest, decoded: any) {
    const sessionFound = await this.sessionsFindByIdRepository.execute(
      Security.decrypt(decoded.sessionId),
    );
    if (Security.hash(request.info.ip) !== sessionFound.ipAddress) {
      throw new AuthUnauthorizedException();
    }
  }

  private attachUserToRequest(request: FastifyRequest, decoded: any) {
    request.user = {
      id: decoded.userId,
      permissions: decoded.permissions,
    };
  }
}
