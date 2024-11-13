import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthResponseDto } from "../../../modules/auth/dtos/auth.dto";
import { AuthUnauthorizedException } from "../../exceptions/auth.unauthorized.exception";

export function AuthSignOutDecorator(uri: string) {
  return applyDecorators(
    Delete(uri),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: HttpStatus.OK,
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      type: AuthUnauthorizedException,
    }),
  );
}
