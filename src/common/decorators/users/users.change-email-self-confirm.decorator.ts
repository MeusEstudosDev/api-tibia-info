import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { Get, HttpCode, HttpStatus, Redirect } from "@nestjs/common";
import { IsPublic } from "../is-public.decorator";

export function UsersChangeEmailSelfConfirmDecorator(uri: string) {
  return applyDecorators(
    IsPublic(),
    Get(uri),
    HttpCode(HttpStatus.OK),
    Redirect(),
  );
}
