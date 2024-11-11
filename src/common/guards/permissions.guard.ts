import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { Security } from "../../utils/security.util";
import { AuthUnauthorizedException } from "../exceptions/auth.unauthorized.exception";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      "permissions",
      context.getHandler(),
    );
    if (!permissions) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user) throw new AuthUnauthorizedException();

    const userPermissionsDecrypt = Security.decrypt(request.user.permissions);

    const userPermissions = JSON.parse(userPermissionsDecrypt);

    const isPermission = permissions.some((permission) =>
      userPermissions.includes(permission),
    );
    if (isPermission) return true;
    throw new AuthUnauthorizedException();
  }
}
