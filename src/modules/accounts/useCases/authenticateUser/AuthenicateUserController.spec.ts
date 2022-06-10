import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Authenticate User Controller', () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to authenticate a user', async () => {
    await request(app).post('/users').send({
      name: 'test',
      email: 'test@gmail.com',
      password: '12345',
      driver_license: 'WWAA-2755',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'test@gmail.com',
        password: '12345',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      name: 'test',
      email: 'test@gmail.com',
    });
  });

  it('Should not be able to authenticate a user using incorrect password', async () => {
    await request(app).post('/users').send({
      name: 'test password',
      email: 'test_password@gmail.com',
      password: '12345',
      driver_license: 'WWAA-2755',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'test_password@gmail.com',
        password: '00000',
      })
      .expect(400);

    expect(response.body.message).toBe('Email or password incorrect!');
  });

  it('Should not be able to authenticate if user does not exist', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'incorrectEmail@gmail.com',
        password: '12345',
      })
      .expect(400);

    expect(response.body.message).toBe('Email or password incorrect!');
  });
});
