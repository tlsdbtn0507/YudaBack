import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONT_URL,
      credentials: true,
    }
  });
  const port = process.env.POSTGRES_HOSTPORT;
  const logger = new Logger('Bootstrap');


  app.use(cookieParser());
  app.useLogger(logger)

  await app.listen(port);
}
bootstrap();
