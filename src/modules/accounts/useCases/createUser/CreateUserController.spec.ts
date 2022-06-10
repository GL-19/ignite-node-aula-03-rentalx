/* import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create User Controller', () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentalx.com.br', '${password}', true, 'now()', 'XXXXXX')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/').send({
      name: 'test create',
      email: 'test_create@gmail.com',
      password: '12345',
      driver_license: 'XXZZ-1155',
    });

    console.log('Teste criação', response.error);

    expect(response.statusCode).toBe(201);
  });

  it('Should not be able to create user with repeated email', async () => {
    await request(app).post('/').send({
      name: 'test email',
      email: 'test_email@gmail.com',
      password: '12345',
      driver_license: 'WWAA-2755',
    });

    const response = await request(app).post('/').send({
      name: 'test email',
      email: 'test_email@gmail.com',
      password: '12345',
      driver_license: 'WWAA-2755',
    });

    console.log('Teste erro', response.error);

    expect(response.body.message).toBe('User already exists');
    expect(response.statusCode).toBe(400);
  });
});
 */
