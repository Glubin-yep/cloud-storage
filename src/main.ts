import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({
    credentials: true,
    origin: true,
    exposedHeaders: ['Content-Disposition'],
  });

  app.use(cookieParser());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('Cloud Storage')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
