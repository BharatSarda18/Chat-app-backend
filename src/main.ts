import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ENV } from './envSchema';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService:ConfigService=app.get(ConfigService);

  app.enableCors({
    origin: [configService.get(ENV.ALLOW_ORIGIN)],
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get(ENV.PORT));
}
bootstrap();
