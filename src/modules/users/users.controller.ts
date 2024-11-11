import { Body, Controller, Param } from "@nestjs/common";
import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersResponseDto } from "./dtos/users.dto";
import { UsersCreateUseCase } from "./use-case/users.create.use-case";
import { UsersCreateDecorator } from "../../common/decorators/users/users.create.decorator";
import { CurrentUserRequest } from "../../common/requests/current-user.request";
import { UsersSignInDto } from "../../common/dtos/users.sign-in.dto";
import { UsersProfileUseCase } from "./use-case/users.profile.use-case";
import { UsersProfileDecorator } from "../../common/decorators/users/users.profile.decorator";
import { MessageDto } from "../../common/dtos/message.dto";
import { UsersUpdateDto } from "./dtos/users.update.dto";
import { UsersUpdateUseCase } from "./use-case/users.update.use-case";
import { UsersUpdateDecorator } from "../../common/decorators/users/users.update.decorator";
import { UsersChangeEmailDto } from "./dtos/users.change-email.dto";
import { UsersChangeEmailUseCase } from "./use-case/users.change-email.use-case";
import { UsersConfirmChangeEmailUseCase } from "./use-case/users.confirm-change-email.use-case";
import { env } from "../../configs/env";
import { UsersChangeEmailSelfDecorator } from "../../common/decorators/users/users.change-email-self.decorator";
import { UsersChangeEmailSelfConfirmDecorator } from "../../common/decorators/users/users.change-email-self-confirm.decorator";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersCreateUseCase: UsersCreateUseCase,
    private readonly usersProfileUseCase: UsersProfileUseCase,
    private readonly usersUpdateUseCase: UsersUpdateUseCase,
    private readonly usersChangeEmailUseCase: UsersChangeEmailUseCase,
    private readonly usersConfirmChangeEmailUseCase: UsersConfirmChangeEmailUseCase,
  ) {}

  @UsersCreateDecorator("create")
  create(@Body() body: UsersCreateDto): Promise<MessageDto> {
    return this.usersCreateUseCase.execute(body);
  }

  @UsersProfileDecorator("profile")
  profile(
    @CurrentUserRequest() userSignIn: UsersSignInDto,
  ): Promise<UsersResponseDto> {
    return this.usersProfileUseCase.execute(userSignIn.id);
  }

  @UsersUpdateDecorator("self/update")
  updateSelf(
    @Body() body: UsersUpdateDto,
    @CurrentUserRequest() user: UsersSignInDto,
  ): Promise<UsersResponseDto> {
    return this.usersUpdateUseCase.execute(body, user.id);
  }

  @UsersChangeEmailSelfDecorator("change-email-self")
  changeEmailSelf(
    @Body() body: UsersChangeEmailDto,
    @CurrentUserRequest() user: UsersSignInDto,
  ): Promise<MessageDto> {
    return this.usersChangeEmailUseCase.execute(body.newEmail, user.id);
  }

  @UsersChangeEmailSelfConfirmDecorator("change-email-self-confirm/:userId")
  async confirmChangeEmailSelf(
    @Param("userId") userId: string,
  ): Promise<{ url: string }> {
    await this.usersConfirmChangeEmailUseCase.execute(userId);
    return { url: env.URL_FRONT };
  }
}
