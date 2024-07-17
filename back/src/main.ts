import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? true : 'https://tlsdbtn0507.github.io/yuda.github.io',
      credentials: true,
    }
  });
  const port = process.env.POSTGRES_HOSTPORT;

  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
