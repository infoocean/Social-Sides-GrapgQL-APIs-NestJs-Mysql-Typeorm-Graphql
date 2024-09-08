import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));
  await app.listen(configService.get<number>('port'));
}
bootstrap();
