import { Body, Controller, Ip } from "@nestjs/common";
import { SignInDto } from "./dtos/auth.sign-in.dto";
import { AuthService } from "./auth.service";
import { AuthSignInDecorator } from "../../common/decorators/auth.sign-in.decorator";
import { AuthResponseDto } from "./dtos/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSignInDecorator("sign-in")
  signIn(
    @Body() { username, password }: SignInDto,
    @Ip() ipAddress: string,
  ): Promise<AuthResponseDto> {
    return this.authService.signIn(username, password, ipAddress);
  }
}
