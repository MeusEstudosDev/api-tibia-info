import { applyDecorators } from "@nestjs/common/decorators/core/apply-decorators";
import { HttpCode, HttpStatus, Patch, Redirect } from "@nestjs/common";
import { IsPublic } from "../is-public.decorator";

export function UsersChangeEmailSelfConfirmDecorator(uri: string) {
  return applyDecorators(
    IsPublic(),
    Patch(uri),
    HttpCode(HttpStatus.OK),
    Redirect(),
  );
}
