import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const {
      expires_in_refresh_token,
      expires_in_token,
      refresh_token_days_to_expire,
      secret_refresh_token,
      secret_token,
    } = auth;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!');
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new AppError('Email or password incorrect!');
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const refreshTokenExpirationDate = this.dateProvider.addDays(
      refresh_token_days_to_expire
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expiration_date: refreshTokenExpirationDate,
    });

    const tokenReturn = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
