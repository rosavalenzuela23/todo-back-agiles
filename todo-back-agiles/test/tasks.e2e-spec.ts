// CREAR UNA TAREA

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';

describe('Tasks - E2E', () => {
  let app: INestApplication;
  let token: string;

  const testUser = {
    email: 'testuser@example.com',
    password: '12345678',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Registrar usuario (ignorar error si ya existe)
    try {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    } catch (error) {
      console.log('Usuario ya existe, continuando...');
    }

    // Login para obtener token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    console.log('Respuesta de login:', loginRes.body);
    
    // Obtener el token (compatible con ambas versiones)
    token = loginRes.body.access_token || loginRes.body.acces_token;
    
    if (!token) {
      console.error('No se pudo obtener el token. Estructura recibida:', loginRes.body);
      throw new Error('Fallo al obtener token');
    }
    
    console.log('Token obtenido correctamente:', token);
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  it('debe crear una tarea asociada al usuario autenticado', async () => {
    const newTask = {
      title: 'Tarea de integración',
      description: 'Esto es una prueba E2E',
      endDate: new Date().toISOString(),
      categoryName: 'Pruebas',
    };

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body).toMatchObject({
      title: newTask.title,
      description: newTask.description,
      categoryName: newTask.categoryName,
      userCreator: testUser.email,
    });
  });
});