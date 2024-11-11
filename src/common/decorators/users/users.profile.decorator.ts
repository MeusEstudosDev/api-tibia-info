import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { ApiResponse } from "@nestjs/swagger";
import { Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersResponseDto } from "../../../modules/users/dtos/users.dto";
import { SecurityCryptInvalidExceptionDto } from "../../dtos/exceptions/security.crypt-invalid.exception.dto";
import { UsersNotFoundExceptionDto } from "../../dtos/exceptions/users.not-found.exception.dto";

export function UsersProfileDecorator(uri: string) {
  return applyDecorators(
    Get(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: UsersResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: SecurityCryptInvalidExceptionDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      type: UsersNotFoundExceptionDto,
    }),
  );
}
