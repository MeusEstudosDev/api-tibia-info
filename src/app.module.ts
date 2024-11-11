import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import { AppController } from "./app.controller";
import { UsersModule } from "./modules/users/users.module";
import { BullModule } from "@nestjs/bullmq";
import { env } from "./configs/env";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { PermissionsGuard } from "./common/guards/permissions.guard";
import { AuthGuard } from "./modules/auth/auth.guard";
import { NodemailerModule } from "./providers/nodemailer/nodemailer.module";
import { SessionsModule } from "./modules/sessions/sessions.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NodemailerModule,
    SessionsModule,

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
