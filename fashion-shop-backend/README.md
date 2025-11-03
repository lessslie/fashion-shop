# Fashion Shop - Backend API

API REST para e-commerce de moda construida con NestJS, TypeScript, PostgreSQL y TypeORM.

## Características Principales

- **Autenticación JWT** con bcrypt para seguridad de contraseñas
- **Sistema de productos** con variantes (colores, talles, stock)
- **Carrito de compras** persistente por usuario
- **Gestión de órdenes** con snapshot de precios
- **Sistema de descuentos** (porcentaje y monto fijo)
- **Paginación** en todos los listados
- **Rate limiting** para prevenir abuse
- **Logging estructurado** con Winston
- **Documentación Swagger** automática
- **Docker** ready con docker-compose
- **Índices de base de datos** optimizados

## Tecnologías

- **NestJS** v11
- **TypeScript** v5.7
- **PostgreSQL** con TypeORM
- **JWT** + Passport para autenticación
- **Cloudinary** para almacenamiento de imágenes
- **Swagger/OpenAPI** para documentación
- **Winston** para logging
- **Helmet** para seguridad HTTP headers
- **Throttler** para rate limiting

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- NPM o Yarn

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd fashion-shop-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# App
NODE_ENV=development
PORT=3000

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=fashion_shop

# JWT
JWT_SECRET=tu_secret_super_seguro
JWT_EXPIRES_IN=24h

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000

# Logging (opcional)
LOG_LEVEL=info
```

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Ejecución con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
# Iniciar PostgreSQL + Backend
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Opción 2: Solo Backend (PostgreSQL externo)

```bash
# Build
docker build -t fashion-shop-backend .

# Run
docker run -p 3000:3000 --env-file .env fashion-shop-backend
```

## Endpoints Disponibles

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Obtener mi perfil | Sí |
| PATCH | `/profile` | Actualizar perfil | Sí |
| PATCH | `/change-password` | Cambiar contraseña | Sí |
| DELETE | `/account` | Eliminar cuenta | Sí |

### Productos (`/api/products`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar productos (paginado) | No |
| GET | `/search?q=termo` | Buscar productos | No |
| GET | `/slug/:slug` | Ver por slug | No |
| GET | `/:id` | Ver por ID | No |
| POST | `/` | Crear producto | Admin |
| PATCH | `/:id` | Actualizar producto | Admin |
| DELETE | `/:id` | Eliminar (soft delete) | Admin |
| POST | `/:id/restore` | Restaurar producto | Admin |

**Query params para listados:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10, max: 100)
- `sortBy`: Campo de ordenamiento (default: createdAt)
- `sortOrder`: ASC o DESC (default: DESC)
- `category`: ROPA, CARTERAS, ACCESORIOS, CALZADOS
- `status`: DRAFT, ACTIVE, ARCHIVED, OUT_OF_STOCK
- `isFeatured`: true/false
- `isNew`: true/false
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo

### Carrito (`/api/cart`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Ver mi carrito | Sí |
| POST | `/items` | Agregar item | Sí |
| PATCH | `/items/:id` | Actualizar cantidad | Sí |
| DELETE | `/items/:id` | Remover item | Sí |
| DELETE | `/` | Vaciar carrito | Sí |

### Órdenes (`/api/orders`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Crear orden (checkout) | Sí |
| GET | `/my-orders` | Mis órdenes (paginado) | Sí |
| GET | `/:id` | Ver detalle de orden | Sí |
| POST | `/:id/cancel` | Cancelar orden | Sí |
| GET | `/` | Todas las órdenes (paginado) | Admin |
| PATCH | `/:id` | Actualizar estado | Admin |

### Cloudinary (`/api/cloudinary`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/upload` | Subir imagen | Admin |

## Documentación Swagger

Una vez iniciada la aplicación, acceder a:

```
http://localhost:3000/api/docs
```

Aquí encontrarás la documentación interactiva completa con todos los endpoints, modelos y ejemplos.

## Arquitectura

```
src/
├── auth/                   # Autenticación JWT
├── users/                  # Gestión de usuarios
│   ├── dto/               # DTOs de usuario
│   ├── entities/          # Entidad User
│   ├── users.controller.ts
│   └── users.service.ts
├── products/              # Gestión de productos
│   ├── dto/
│   ├── entities/          # Product, ProductVariant
│   ├── products.controller.ts
│   └── products.service.ts
├── cart/                  # Carrito de compras
├── orders/                # Gestión de órdenes
├── cloudinary/            # Upload de imágenes
├── guards/                # JWT y Roles guards
├── common/                # Decorators, DTOs e interfaces compartidas
│   ├── decorators/
│   ├── dto/              # PaginationDto
│   ├── helpers/          # pagination.helper.ts
│   └── interfaces/       # PaginatedResponse, etc.
└── config/                # Configuraciones
    ├── database.config.ts
    ├── env.validation.ts
    ├── logger.config.ts
    └── swagger.config.ts
```

## Modelos de Datos

### User
- ID, email (único), password (bcrypt), name, phone
- Role: USER o ADMIN
- Relaciones: Cart (1:1), Orders (1:N)

### Product
- ID, name, slug (único), description
- category, subcategory, brand
- basePrice, hasDiscount, discountType, discountValue
- images[], styleTags[], categoryTags[]
- status, isFeatured, isNew
- totalSold, viewCount
- Relaciones: ProductVariants (1:N)

### ProductVariant
- ID, SKU (único), color, size
- stock, lowStockThreshold
- isActive, isOutOfStock
- Relación: Product (N:1)

### Order
- ID, orderNumber (único)
- Datos de facturación (firstName, lastName, address, etc.)
- subtotal, discount, total
- paymentMethod, paymentStatus
- status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- Relaciones: User (N:1), OrderItems (1:N)

## Seguridad

### Autenticación
- JWT con bcrypt (salt rounds: 10)
- Tokens con expiración configurable
- Guards globales para proteger rutas

### Rate Limiting
- 100 requests por minuto por IP
- Throttler global en todas las rutas

### Headers de Seguridad
- Helmet configurado para headers HTTP seguros
- CORS configurado para frontend específico

### Validación
- ValidationPipe global con class-validator
- DTOs estrictos en todos los endpoints
- Whitelist y forbidNonWhitelisted habilitados

## Performance

### Paginación
- Implementada en todos los listados
- Configuración: 1-100 items por página
- Metadata incluido (totalPages, hasNextPage, etc.)

### Índices de Base de Datos
- Índices en campos frecuentemente consultados
- Índices compuestos para queries complejas:
  - `products`: category+status, slug, createdAt, name
  - `orders`: userId+status, orderNumber, createdAt

### Soft Delete
- Productos eliminados mantienen referencia histórica
- No afecta órdenes ya creadas

## Logging

Sistema de logs con Winston:

```
logs/
├── combined.log      # Todos los logs
├── error.log        # Solo errores
├── exceptions.log   # Excepciones no capturadas
└── rejections.log   # Promise rejections
```

Niveles de log: error, warn, info, http, verbose, debug, silly

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Scripts Disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar con hot-reload
npm run start:prod     # Iniciar en producción
npm run build          # Compilar TypeScript
npm run lint           # Ejecutar ESLint
npm run format         # Formatear con Prettier
```

## Variables de Entorno

| Variable | Descripción | Requerida | Default |
|----------|-------------|-----------|---------|
| NODE_ENV | Entorno (development/production) | No | development |
| PORT | Puerto de la aplicación | No | 3000 |
| DB_HOST | Host de PostgreSQL | Sí | - |
| DB_PORT | Puerto de PostgreSQL | No | 5432 |
| DB_USERNAME | Usuario de PostgreSQL | Sí | - |
| DB_PASSWORD | Contraseña de PostgreSQL | Sí | - |
| DB_DATABASE | Nombre de la base de datos | Sí | - |
| JWT_SECRET | Secret para firmar JWT | Sí | - |
| JWT_EXPIRES_IN | Tiempo de expiración del JWT | No | 24h |
| CLOUDINARY_CLOUD_NAME | Cloud name de Cloudinary | Sí | - |
| CLOUDINARY_API_KEY | API Key de Cloudinary | Sí | - |
| CLOUDINARY_API_SECRET | API Secret de Cloudinary | Sí | - |
| FRONTEND_URL | URL del frontend para CORS | No | http://localhost:5173 |
| LOG_LEVEL | Nivel de logging | No | info |

## Roadmap / TODOs

- [ ] Implementar sistema de email con templates
- [ ] Agregar webhooks de Mercado Pago
- [ ] Implementar wishlist (favoritos)
- [ ] Sistema de reviews y ratings
- [ ] Caché con Redis
- [ ] CI/CD con GitHub Actions
- [ ] Métricas con Prometheus
- [ ] Testing completo (unit + e2e)

## Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

MIT

## Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

## Autores

- **Tu Nombre** - [GitHub](https://github.com/tu-usuario)

---

Hecho con ❤️ usando NestJS
