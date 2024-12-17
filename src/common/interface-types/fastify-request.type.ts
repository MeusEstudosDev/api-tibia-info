import { FastifyRequest } from "fastify";
import { UsersSignInDto } from "../dtos/users.sign-in.dto";
import { RequestInfoDto } from "../dtos/request.info.dto";

declare module "fastify" {
  interface FastifyRequest {
    cookies: { [cookieName: string]: string | undefined };
    info?: RequestInfoDto;
    user?: UsersSignInDto;
  }
}
