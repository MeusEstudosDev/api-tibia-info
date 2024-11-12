import { Body, Controller, Ip, Res } from "@nestjs/common";
import { SignInDto } from "./dtos/auth.sign-in.dto";
import { AuthService } from "./auth.service";
import { AuthSignInDecorator } from "../../common/decorators/auth.sign-in.decorator";
import { FastifyReply } from "fastify";
import { MessageDto } from "../../common/dtos/message.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSignInDecorator("sign-in")
  signIn(
    @Body() { username, password }: SignInDto,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<MessageDto> {
    return this.authService.signIn(username, password, ipAddress, res);
  }
}
