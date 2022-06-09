import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepository: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should create an user', async () => {
    const createUserData: ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@email.com',
      driver_license: 'XSWR-1234',
      password: 'senha12345',
    };

    await createUserUseCase.execute(createUserData);
    const user = await usersRepository.findByEmail(createUserData.email);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('password');
    expect(user.email).toBe(createUserData.email);
    expect(user.name).toBe(createUserData.name);
    expect(user.driver_license).toBe(createUserData.driver_license);
  });

  it('should not create an user if email already exists', async () => {
    const createUserData: ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@email.com',
      driver_license: 'XSWR-1234',
      password: 'senha12345',
    };

    await createUserUseCase.execute(createUserData);

    await expect(createUserUseCase.execute(createUserData)).rejects.toEqual(
      new AppError('User already exists')
    );
  });
});
