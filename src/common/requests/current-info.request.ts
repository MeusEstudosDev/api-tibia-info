import { createParamDecorator } from "@nestjs/common/decorators/http/create-route-param-metadata.decorator";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { FastifyRequest } from "fastify";

async function callback(data: unknown, context: ExecutionContext) {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return request.info;
}

export const CurrentInfoRequest = createParamDecorator(callback);
