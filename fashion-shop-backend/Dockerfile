# ====================
# STAGE 1: Build
# ====================
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para bcrypt y otras librerías nativas
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# ====================
# STAGE 2: Production
# ====================
FROM node:20-alpine AS production

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Copiar node_modules desde builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copiar código compilado
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Cambiar a usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
