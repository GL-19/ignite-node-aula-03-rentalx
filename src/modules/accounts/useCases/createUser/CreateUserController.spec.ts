import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create User Controller', () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Glauber',
        email: 'glauber@email.com',
        password: '12345',
        driver_license: '987654321',
      })
      .expect(201);
  });

  it('Should not be able to create user with a repeated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'test email',
        email: 'test_email@gmail.com',
        password: '12345',
        driver_license: 'WWAA-2755',
      })
      .expect(201);

    const response = await request(app)
      .post('/users')
      .send({
        name: 'test email',
        email: 'test_email@gmail.com',
        password: '12345',
        driver_license: 'WWAA-2755',
      })
      .expect(400);

    expect(response.body.message).toBe('User already exists');
  });
});
