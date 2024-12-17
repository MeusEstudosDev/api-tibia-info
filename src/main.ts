import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
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
import fastifyCookie from "@fastify/cookie";

import { AppModule } from "./app.module";
import { env } from "./configs/env";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: "http://localhost:4000",
    credentials: true,
  });

  await app.register(fastifyCookie as any, {
    secret: env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
    },
  });

  await app.register(fastifyCsrf as any);

  await app.register(fastifyStatic as any, {
    root: join(__dirname, "..", "public"),
    prefix: "/",
  });

  await app.register(helmet as any);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ["transform"] },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("API Tibia-Info.com")
    .setDescription("API Tibia-Info.com")
    .setVersion("1.0")
    .addTag("tibia-info")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);

  await app.listen(Number(env.PORT), "0.0.0.0", () =>
    Logger.log("Server is running PORT: " + env.PORT),
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().then();
