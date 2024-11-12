import { FastifyRequest } from "fastify";
import { UsersSignInDto } from "../dtos/users.sign-in.dto";
import { RequestInfoDto } from "../dtos/request.info.dto";

declare module "fastify" {
  interface FastifyRequest {
    info?: RequestInfoDto;
    user?: UsersSignInDto;
    cookies: any;
  }
}
