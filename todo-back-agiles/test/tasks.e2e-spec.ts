import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AppModule } from '../src/app.module';  // <-- Ajusta la ruta si tu app.module está en otro sitio

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  
    // Crea el usuario si no existe
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@e2e.com', password: 'changeme' });
  
    // Login para obtener el token
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@e2e.com', password: 'changeme' })
      .expect(200); // <--- Asegúrate que sea 200, no 201
  
    jwtToken = res.body.access_token;
  });
  

  afterAll(async () => {
    const connection = app.get<Connection>(getConnectionToken());
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  it('/tasks (POST) → debería crear una tarea', async () => {
    const createDto = {
      title: 'Tarea de prueba',
      description: 'Descripción',
      categoryName: 'testing',
      endDate: '2025-06-01T00:00:00.000Z',
    };
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createDto)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(createDto.title);
    expect(res.body.userCreator).toBeDefined();
    createdTaskId = res.body._id;
  });

  it('/tasks (GET) → solo debería traer la tarea creada', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(t => t._id === createdTaskId)).toBeTruthy();
  });

  it('/tasks/:id (PUT) → debería actualizar el título', async () => {
    const updateDto = { title: 'Título actualizado' };
    const res = await request(app.getHttpServer())
      .put(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateDto)
      .expect(200);

    expect(res.body.title).toBe(updateDto.title);
  });

  it('/tasks/:id/status (PATCH) → debería cambiar el estado', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${createdTaskId}/status`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ status: 'completada' })
      .expect(200);

    expect(res.body.status).toBe('completada');
  });

  it('/tasks/:id (DELETE) → debería eliminar la tarea', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const resAfter = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(resAfter.body.find(t => t._id === createdTaskId)).toBeFalsy();
  });
});
