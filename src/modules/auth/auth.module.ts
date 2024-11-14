import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthSignInUseCase } from "./use-case/auth.sign-in.use-case";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { env } from "../../configs/env";
import { PassportModule } from "@nestjs/passport";
import { SessionsModule } from "../sessions/sessions.module";
import { AuthSignOutUseCase } from "./use-case/auth.sign-out.use-case";
import { IpInfoModule } from "../../providers/ip-info/ip-info.module";

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    IpInfoModule,

    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthSignInUseCase, AuthSignOutUseCase],
  exports: [],
})
export class AuthModule {}
