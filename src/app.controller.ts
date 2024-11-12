import { Controller, Get, Inject, Param, Req, Res } from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CurrentUserRequest } from "./common/requests/current-user.request";
import { FastifyReply, FastifyRequest } from "fastify";
import { IsPublic } from "./common/decorators/is-public.decorator";
import { randomUUID } from "node:crypto";

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  // Criar proteção para a rota para apenas administradores da API
  @Get()
  async resetCached(@CurrentUserRequest() info: any) {
    await this.cache.reset();
  }

  @Get("set")
  async set() {
    await this.cache.set("1", "2222");
  }

  @Get("get")
  async get() {
    const cached = await this.cache.get("1");
    if (cached) {
      return {
        cached,
      };
    }
  }

  @Get("profile-cache/:id")
  async profileCache(@Param("id") id: string) {
    const cached = await this.cache.get(id);
    return {
      cached,
    };
  }

  @IsPublic()
  @Get("cookie")
  findAll(@Req() request: FastifyRequest) {
    console.log("req", request.cookies);
  }

  @IsPublic()
  @Get("set-cookie")
  findAlls(@Res({ passthrough: true }) response: FastifyReply) {
    response.setCookie("accessToken", randomUUID());
  }
}
