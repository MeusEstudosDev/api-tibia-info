import { UsersCreateDto } from "../dtos/users.create.dto";
import { UsersDto } from "../dtos/users.dto";
import { User } from "../users.entity";
import { Inject, Injectable } from "@nestjs/common";
import { UsersCreateRepository } from "../repositories/users.create.repository";
import { UsersAlreadyExistsRepository } from "../repositories/users.already-exists.repository";
import { Security } from "../../../utils/security.util";
import { resolve } from "path";
import fs from "node:fs";
import { env } from "../../../configs/env";
import * as handlebars from "handlebars";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { MessageDto } from "../../../common/dtos/message.dto";

@Injectable()
export class UsersCreateUseCase {
  constructor(
    private readonly usersCreateRepository: UsersCreateRepository,
    private readonly usersAlreadyExistsRepository: UsersAlreadyExistsRepository,

    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue("send-email") private readonly sendEmailQueue: Queue,
  ) {}

  async execute(dto: UsersCreateDto): Promise<MessageDto> {
    const UserEntity = new User();
    UserEntity.create = dto;

    const userJson: UsersDto = UserEntity.toJson;

    await this.usersAlreadyExistsRepository.execute({
      username: userJson.username,
      email: userJson.email,
    });

    const userCreate: UsersDto = await this.usersCreateRepository.execute(
      UserEntity.toJson,
    );

    await this.createHtmlTemplate(
      `${userCreate.firstName} ${userCreate.lastName}`,
      userCreate.emailHash,
      userCreate.id,
    );

    await this.cache.set(userCreate.id, JSON.stringify(UserEntity.response), {
      ttl: 60 * 5,
    });

    return { message: "Usuário criado com sucesso" };
  }

  private async createHtmlTemplate(
    name: string,
    email: string,
    userId: string,
  ): Promise<string> {
    const createUserTemplate = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "src",
      "providers",
      "nodemailer",
      "templates",
      "create-user.hbs",
    );

    const variables = {
      name,
      link: env.URL_FRONT + "/confirm-email/" + Security.encrypt(userId),
    };

    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: "utf-8",
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    const html = parseTemplate(variables);

    const emailData = JSON.stringify({
      to: Security.decrypt(email),
      subject: "Confirmação de e-mail",
      html,
    });

    await this.sendEmailQueue.add("transcode", emailData);

    return;
  }
}
