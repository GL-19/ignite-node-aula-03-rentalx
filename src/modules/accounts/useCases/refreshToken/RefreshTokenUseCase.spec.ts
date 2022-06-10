import { sign, verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let refreshTokenUseCase: RefreshTokenUseCase;

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();

    dateProvider = new DayjsDateProvider();

    createUserUseCase = new CreateUserUseCase(usersRepository);

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider
    );

    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepository,
      dateProvider
    );
  });

  it('Should be able to return refresh_token and new token', async () => {
    const userData = {
      name: 'test create',
      email: 'test_create@gmail.com',
      password: '12345',
      driver_license: 'XXZZ-1155',
    };

    await createUserUseCase.execute(userData);

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    const response = await refreshTokenUseCase.execute(refresh_token);

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refresh_token');
  });

  it('should not return new token if refresh token is invalid ', async () => {
    await expect(
      refreshTokenUseCase.execute('adjnasdpoasdpál')
    ).rejects.toEqual(new AppError('Invalid refresh token!', 401));
  });

  it('should not return new token if refresh token is not found', async () => {
    const refresh_token = sign(
      { email: 'test@email.com' },
      auth.secret_refresh_token,
      {
        subject: '12345',
        expiresIn: auth.expires_in_refresh_token,
      }
    );

    console.log(refresh_token);

    const { email, sub: user_id } = verify(
      refresh_token,
      auth.secret_refresh_token
    );

    console.log(email, user_id);

    await expect(refreshTokenUseCase.execute(refresh_token)).rejects.toEqual(
      new AppError('Refresh Token does not exist!')
    );
  });
});
