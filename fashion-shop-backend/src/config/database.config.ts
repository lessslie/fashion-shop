import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const requiredEnvVars = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  const port = parseInt(requiredEnvVars.DB_PORT as string, 10);
  if (isNaN(port)) {
    throw new Error('DB_PORT must be a valid number');
  }

  return {
    type: 'postgres',
    host: requiredEnvVars.DB_HOST as string,
    port: port,
    username: requiredEnvVars.DB_USERNAME as string,
    password: requiredEnvVars.DB_PASSWORD as string,
    database: requiredEnvVars.DB_DATABASE as string,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: {
      rejectUnauthorized: false,
    },
    // ✅ Configuración de conexión más robusta
    extra: {
      max: 10, // Máximo de conexiones en el pool
      connectionTimeoutMillis: 10000, // 10 segundos timeout
    },
    retryAttempts: 3,
    retryDelay: 3000, // 3 segundos entre reintentos
  };
});
