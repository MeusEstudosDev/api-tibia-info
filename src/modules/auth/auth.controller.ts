import { Body, Controller, Ip, Res } from "@nestjs/common";
import { SignInDto } from "./dtos/auth.sign-in.dto";
import { AuthSignInUseCase } from "./use-case/auth.sign-in.use-case";
import { AuthSignInDecorator } from "../../common/decorators/auth/auth.sign-in.decorator";
import { FastifyReply } from "fastify";
import { MessageDto } from "../../common/dtos/message.dto";
import { CurrentInfoRequest } from "../../common/requests/current-info.request";
import { CurrentUserRequest } from "../../common/requests/current-user.request";
import { UsersSignInDto } from "../../common/dtos/users.sign-in.dto";
import { AuthSignOutUseCase } from "./use-case/auth.sign-out.use-case";
import { RequestInfoDto } from "../../common/dtos/request.info.dto";
import { AuthSignOutDecorator } from "../../common/decorators/auth/auth.sign-out.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authSignInUseCase: AuthSignInUseCase,
    private readonly authSignOutUseCase: AuthSignOutUseCase,
  ) {}

  @AuthSignInDecorator("sign-in")
  signIn(
    @Body() { username, password }: SignInDto,
    @CurrentInfoRequest() { ip, headers }: RequestInfoDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<MessageDto> {
    const dto = {
      res,
      username,
      password,
      ipAddress: ip,
      userAgent: headers["user-agent"],
    };

    return this.authSignInUseCase.execute(dto);
  }

  @AuthSignOutDecorator("sign-out")
  signOut(
    @CurrentUserRequest() { id }: UsersSignInDto,
    @CurrentInfoRequest() { token }: RequestInfoDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<MessageDto> {
    return this.authSignOutUseCase.execute(id, token, res);
  }
}
