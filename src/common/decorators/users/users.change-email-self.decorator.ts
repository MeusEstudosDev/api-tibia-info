import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { ApiResponse } from "@nestjs/swagger";
import { HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { MessageDto } from "../../dtos/message.dto";
import { UsersChangeEmailAlreadyExistsDto } from "../../dtos/exceptions/users.change-email-already-exists.dto";
import { UsersAlreadyExistsExceptionDto } from "../../dtos/exceptions/users.already-exists.exception.dto";
import { UsersNotFoundExceptionDto } from "../../dtos/exceptions/users.not-found.exception.dto";

export function UsersChangeEmailSelfDecorator(uri: string) {
  return applyDecorators(
    Patch(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: MessageDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      type: UsersChangeEmailAlreadyExistsDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      type: UsersAlreadyExistsExceptionDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      type: UsersNotFoundExceptionDto,
    }),
  );
}
