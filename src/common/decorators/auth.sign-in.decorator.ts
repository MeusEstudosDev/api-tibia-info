import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { IsPublic } from "./is-public.decorator";
import { HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthResponseDto } from "../../modules/auth/dtos/auth.dto";
import { UsersCredentialInvalidExceptionDto } from "../dtos/exceptions/users.credential-invalid.exception.dto";

export function AuthSignInDecorator(uri: string) {
  return applyDecorators(
    IsPublic(),
    Post(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      type: UsersCredentialInvalidExceptionDto,
    }),
  );
}
