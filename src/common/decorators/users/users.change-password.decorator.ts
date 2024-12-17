import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { IsPublic } from "../is-public.decorator";
import { HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { MessageDto } from "../../dtos/message.dto";

export function UsersChangePasswordDecorator(uri: string) {
  return applyDecorators(
    IsPublic(),
    Post(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: MessageDto,
    }),
  );
}
