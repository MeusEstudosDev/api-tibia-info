import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { ApiResponse } from "@nestjs/swagger";
import { HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { UsersResponseDto } from "../../../modules/users/dtos/users.dto";
import { UsersNotFoundExceptionDto } from "../../dtos/exceptions/users.not-found.exception.dto";
import { UsersAlreadyExistsExceptionDto } from "../../dtos/exceptions/users.already-exists.exception.dto";

export function UsersUpdateDecorator(uri: string) {
  return applyDecorators(
    Patch(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: UsersResponseDto,
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
