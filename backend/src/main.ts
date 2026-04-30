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

  const baseUrl =
    process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  // 🔒 Security (fixed for Swagger compatibility)
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // Global rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    }),
  );

   // Auth rate limits
   app.use(
     '/api/v1/auth/login',
     rateLimit({
       windowMs: 15 * 60 * 1000,
       max: 10,
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
       message: {
         success: false,
         message: 'Too many login attempts, please try again later',
       },
     }),
   );

   app.use(
     '/auth/forgot-password',
     rateLimit({
       windowMs: 15 * 60 * 1000,
       max: 10,
       message: {
         success: false,
         message: 'Too many password reset requests, please try again later',
       },
     }),
   );

  // 🌍 CORS
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // 🌐 Global prefix
  app.setGlobalPrefix('api/v1');

  // 🧰 Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 🔄 Serialization
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // 🚨 Global error handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 📘 Swagger (FIXED FOR RENDER)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SkulAfrica API')
    .setDescription('API documentation for SkulAfrica backend')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(baseUrl)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  // 🚀 Start server
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server running on ${baseUrl}/api/v1`);
  console.log(`📘 Swagger docs available at ${baseUrl}/api`);
}

bootstrap();

