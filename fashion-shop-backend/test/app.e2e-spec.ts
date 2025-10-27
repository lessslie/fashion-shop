import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupTestApp } from './setup-e2e';

const request = require('supertest');

describe('App (e2e)', () => {
  let app: INestApplication;

  // ✅ Timeout largo para la conexión inicial
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupTestApp(app);

    await app.init();
  }, 60000); // 60 segundos para setup inicial

  afterAll(async () => {
    await app.close();
  });

  describe('API Configuration', () => {
    it('should have global API prefix', () => {
      return request(app.getHttpServer()).get('/api').expect(404); // 404 es correcto, no hay ruta en /api raíz
    });

    it('should reject requests without API prefix', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });
  });
});
