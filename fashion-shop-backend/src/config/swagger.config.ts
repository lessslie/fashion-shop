import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Fashion Shop API')
  .setDescription(
    'API REST para e-commerce de moda. Incluye gestión de productos, usuarios, carritos, órdenes y más.',
  )
  .setVersion('1.0')
  .setContact(
    'Tu Nombre',
    'https://github.com/tu-usuario/fashion-shop-backend',
    'tu-email@example.com',
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
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingresá tu JWT token para autenticarte',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:3000', 'Desarrollo Local')
  .addServer('https://api.fashionshop.com', 'Producción')
  .build();

export const swaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
  customSiteTitle: 'Fashion Shop API Docs',
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 20px; border-radius: 4px; }
  `,
};
