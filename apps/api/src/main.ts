import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalInterceptors(new RateLimitInterceptor(100, 60 * 1000));

  app.enableCors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`NurseSphere API running on http://localhost:${port}`);
}

bootstrap();
