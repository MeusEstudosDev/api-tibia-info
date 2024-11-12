import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common/services/logger.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import fastifyCsrf from "@fastify/csrf-protection";
import fastifyStatic from "@fastify/static";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { env } from "./configs/env";
import fastifyCookie from "@fastify/cookie";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  await app.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ["transform"] },
    }),
  );

  await app.register(fastifyStatic, {
    root: join(__dirname, "..", "public"),
    prefix: "/",
  });

  await app.register(helmet);

  await app.register(fastifyCsrf);

  const config = new DocumentBuilder()
    .setTitle("API Tibia-Info.com")
    .setDescription("API Tibia-Info.com")
    .setVersion("1.0")
    .addTag("tibia-info")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);

  await app.listen(Number(env.PORT), () => Logger.log(env.PORT, "Bootstrap"));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().then((r) => r);
