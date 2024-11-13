import { createParamDecorator } from "@nestjs/common/decorators/http/create-route-param-metadata.decorator";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { FastifyRequest } from "fastify";
import { UsersSignInDto } from "../dtos/users.sign-in.dto";

async function callback(data: unknown, context: ExecutionContext) {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return request.user;
}

export const CurrentUserRequest = createParamDecorator(callback);
