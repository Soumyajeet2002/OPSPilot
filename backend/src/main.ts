import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.use(helmet());

  app.use(cookieParser());

  const allowedOrigins = (
    configService.get<string>('CORS_ORIGINS') ??
    'http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const details = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints ?? {}),
        }));

        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details,
          },
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OpsPilot API')
    .setDescription('OpsPilot Enterprise Operations API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);

  console.log(`OpsPilot API running on http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();