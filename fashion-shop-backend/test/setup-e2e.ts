import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupTestApp(app: INestApplication): void {
  // Aplicar misma configuración que en main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
}
