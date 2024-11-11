import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { ApiResponse } from "@nestjs/swagger";
import { HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersAlreadyExistsExceptionDto } from "../../dtos/exceptions/users.already-exists.exception.dto";
import { IsPublic } from "../is-public.decorator";
import { MessageDto } from "../../dtos/message.dto";

export function UsersCreateDecorator(uri: string) {
  return applyDecorators(
    IsPublic(),
    Post(uri),
    HttpCode(HttpStatus.CREATED),
    ApiResponse({
      status: HttpStatus.CREATED,
      type: MessageDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      type: UsersAlreadyExistsExceptionDto,
    }),
  );
}
