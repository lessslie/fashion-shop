import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Permitir requests desde el frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remover propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Error si envían propiedades extras
      transform: true, // Transformar tipos automáticamente
    }),
  );

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // 🔥 CONFIGURACIÓN DE SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Fashion Shop API')
    .setDescription(
      'API REST para e-commerce de moda. Incluye gestión de productos, usuarios, carritos, órdenes y más.',
    )
    .setVersion('1.0')
    .setContact(
      'Fashion',
      'https://github.com/lessslie/fashion-shop-backend',
      'agata.morales92@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('categories', 'Gestión de categorías')
    .addTag('products', 'Gestión de productos')
    .addTag('cart', 'Carrito de compras')
    .addTag('orders', 'Gestión de órdenes')
    .addTag('reviews', 'Reviews y calificaciones')
    .addTag('blog', 'Blog posts')
    .addTag('newsletter', 'Newsletter')
    .addTag('contact', 'Formulario de contacto')
    // 🔥 JWT BEARER AUTH GLOBAL
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresá tu JWT token para autenticarte',
        in: 'header',
      },
      'JWT-auth', // Este nombre lo usamos en @ApiBearerAuth('JWT-auth')
    )
    .addServer('http://localhost:3000', 'Desarrollo Local')
    .addServer('https://api.fashionshop.com', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔥 Swagger UI disponible en /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token después de refresh
      tagsSorter: 'alpha', // Ordena tags alfabéticamente
      operationsSorter: 'alpha', // Ordena endpoints alfabéticamente
    },
    customSiteTitle: 'Fashion Shop API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; border-radius: 4px; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    🚀 Server running on: http://localhost:${port}/api
    📚 Swagger docs: http://localhost:${port}/api/docs
  `);
}
void bootstrap();
