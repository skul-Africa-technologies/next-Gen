import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3001;
  const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
  const FRONTEND_URL = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const SWAGGER_ENABLED = configService.get<string>('SWAGGER_ENABLED') !== 'false';

  const baseUrl =
    process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(
    '/api/v1/auth/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many login attempts, please try again later',
      },
    }),
  );

  app.use(
    '/api/v1/auth/admin/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many login attempts, please try again later',
      },
    }),
  );

  app.use(
    '/api/v1/auth/forgot-password',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many password reset requests, please try again later',
      },
    }),
  );

  const corsOrigins = [FRONTEND_URL];
  if (NODE_ENV === 'development') {
    corsOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  if (SWAGGER_ENABLED) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('SkulAfrica API')
      .setDescription('API documentation for SkulAfrica backend')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
        },
        'JWT-auth',
      )
      .addServer(baseUrl, 'Current server')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });
  }

  const server = await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server running on ${baseUrl}/api/v1`);
  if (SWAGGER_ENABLED) {
    console.log(`📘 Swagger docs available at ${baseUrl}/api`);
  }

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, closing server gracefully...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
  });
}

bootstrap();
