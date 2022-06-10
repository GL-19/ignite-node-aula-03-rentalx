import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    let email: string;
    let user_id: string;
    /*  { email, sub: user_id } */
    try {
      const verifyResponse = verify(
        refresh_token,
        auth.secret_refresh_token
      ) as IPayload;

      email = verifyResponse.email;
      user_id = verifyResponse.sub;
    } catch (err) {
      throw new AppError('Invalid refresh token!', 401);
    }
    console.log('cheguei no banco');

    const userRefreshToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        refresh_token
      );

    console.log('cheguei no erro');

    if (!userRefreshToken) {
      throw new AppError('Refresh Token does not exist!');
    }

    await this.usersTokensRepository.deleteById(userRefreshToken.id);

    const newRefreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expiration_date = this.dateProvider.addDays(
      auth.refresh_token_days_to_expire
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: newRefreshToken,
      expiration_date,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });

    return {
      refresh_token: newRefreshToken,
      token: newToken,
    };
  }
}

export { RefreshTokenUseCase };
